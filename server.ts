import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = 'gemini-4-hydrogen';

const ALLOWED_EVENT_TYPES = new Set([
  'Wedding',
  'Engagement',
  'Birthday',
  'Anniversary',
  'Corporate Offsite',
  'Baby Shower',
]);

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured. Please set it in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function generateWithRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      if (status && status >= 400 && status < 500 && status !== 429) {
        throw err;
      }
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 600 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError;
}

function sanitizeText(value: unknown, maxLen = 200): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

const planResponseSchema = {
  type: Type.OBJECT,
  properties: {
    shubhSummary: {
      type: Type.STRING,
      description: 'A warm, practical 2-sentence overview from Shubh explaining how the budget and timeline are structured for this celebration.',
    },
    timeline: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          phase: { type: Type.STRING, description: 'E.g. 8 Weeks Out, 2 Weeks Out, Event Morning, Evening Ceremony' },
          title: { type: Type.STRING },
          dueDate: { type: Type.STRING, description: 'Human-readable date or relative milestone date' },
          owner: { type: Type.STRING, description: 'Who owns this task, e.g. Host Family, Decor Lead, Shubh Auto' },
          status: { type: Type.STRING, description: 'Must be one of: Pending, In Progress, Done' },
        },
        required: ['id', 'phase', 'title', 'dueDate', 'owner', 'status'],
      },
    },
    vendors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING },
          vendorName: { type: Type.STRING },
          specialty: { type: Type.STRING },
          estimatedCost: { type: Type.NUMBER },
          locationNote: { type: Type.STRING },
          status: { type: Type.STRING, description: 'Must be one of: Recommended, Shortlisted, Booked' },
        },
        required: ['id', 'category', 'vendorName', 'specialty', 'estimatedCost', 'locationNote', 'status'],
      },
    },
    budgetBreakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING },
          allocated: { type: Type.NUMBER },
          spent: { type: Type.NUMBER },
          notes: { type: Type.STRING },
        },
        required: ['id', 'category', 'allocated', 'spent', 'notes'],
      },
    },
    rsvps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          guestName: { type: Type.STRING },
          group: { type: Type.STRING },
          partySize: { type: Type.INTEGER },
          dietary: { type: Type.STRING },
          rsvpStatus: { type: Type.STRING, description: 'Must be one of: Confirmed, Pending, Declined' },
        },
        required: ['id', 'guestName', 'group', 'partySize', 'dietary', 'rsvpStatus'],
      },
    },
    reminders: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          channel: { type: Type.STRING, description: 'Must be one of: WhatsApp, Email, SMS' },
          scheduledFor: { type: Type.STRING },
          recipientGroup: { type: Type.STRING },
          status: { type: Type.STRING, description: 'Must be one of: Scheduled, Sent' },
        },
        required: ['id', 'title', 'channel', 'scheduledFor', 'recipientGroup', 'status'],
      },
    },
  },
  required: ['shubhSummary', 'timeline', 'vendors', 'budgetBreakdown', 'rsvps', 'reminders'],
};

const replanResponseSchema = {
  type: Type.OBJECT,
  properties: {
    shubhNote: {
      type: Type.STRING,
      description: 'Clear 2-sentence explanation from Shubh describing the replanning decisions made.',
    },
    changesSummary: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 to 4 concise bullet descriptions of exact updates applied to timeline, budget, vendors, or reminders.',
    },
    timeline: planResponseSchema.properties.timeline,
    vendors: planResponseSchema.properties.vendors,
    budgetBreakdown: planResponseSchema.properties.budgetBreakdown,
    reminders: planResponseSchema.properties.reminders,
  },
  required: ['shubhNote', 'changesSummary', 'timeline', 'vendors', 'budgetBreakdown', 'reminders'],
};

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/plan', async (req, res) => {
    try {
      const body = req.body ?? {};
      const eventType = sanitizeText(body.eventType, 40);
      const eventName = sanitizeText(body.eventName, 100);
      const city = sanitizeText(body.city, 80);
      const eventDate = sanitizeText(body.eventDate, 30);
      const styleNotes = sanitizeText(body.styleNotes, 400);
      const currency = body.currency === 'USD' ? 'USD' : 'INR';
      const budget = Number(body.budget);
      const guestCount = Number(body.guestCount);

      if (!ALLOWED_EVENT_TYPES.has(eventType)) {
        res.status(400).json({ error: 'Please select a valid event type.' });
        return;
      }
      if (!eventName || !city || !eventDate) {
        res.status(400).json({ error: 'Event name, city, and event date are required.' });
        return;
      }
      if (!Number.isFinite(budget) || budget <= 0 || budget > 1_000_000_000) {
        res.status(400).json({ error: 'Please enter a valid positive budget.' });
        return;
      }
      if (!Number.isFinite(guestCount) || guestCount < 5 || guestCount > 10_000) {
        res.status(400).json({ error: 'Guest count must be between 5 and 10,000.' });
        return;
      }

      const ai = getGeminiClient();
      const prompt = [
        `You are Shubh, the intelligent AI celebration planner for Utsav AI.`,
        `Create a practical, culturally thoughtful, high-precision event plan for:`,
        `- Event Type: ${eventType}`,
        `- Event Name: ${eventName}`,
        `- City / Location: ${city}`,
        `- Event Date: ${eventDate}`,
        `- Total Budget: ${budget} ${currency}`,
        `- Expected Guests: ${guestCount}`,
        `- Aesthetic & Notes: ${styleNotes || 'Warm, festive, well-paced celebration'}`,
        ``,
        `Requirements:`,
        `1. Generate 7 timeline items spanning pre-event preparation through event-day execution. Use dates leading up to ${eventDate}.`,
        `2. Generate 6 realistic vendor recommendations tailored to ${city} and ${eventType}, with realistic estimatedCost numbers in ${currency}.`,
        `3. Generate 6 budgetBreakdown categories whose "allocated" values sum cleanly to ${budget}. Set realistic initial "spent" amounts (roughly 15-30% committed deposits overall, never exceeding allocated).`,
        `4. Generate 8 starter RSVP household entries appropriate for ${eventType} with realistic Indian/global names, party sizes, dietary notes, and varied statuses (Confirmed, Pending, Declined).`,
        `5. Generate 5 automated reminders across WhatsApp, Email, and SMS.`,
        `Keep all IDs short unique strings like "tl-1", "vd-1", "bg-1", "rs-1", "rm-1".`,
      ].join('\n');

      const response = await generateWithRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: prompt,
          config: {
            systemInstruction:
              'You are Shubh, a seasoned celebration and logistics planner. Return crisp, realistic, actionable JSON matching the requested schema. Avoid buzzwords or fluff.',
            responseMimeType: 'application/json',
            responseSchema: planResponseSchema,
          },
        })
      );

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'Shubh returned an empty response. Please try again.' });
        return;
      }

      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to generate event plan.';
      const status = (err as { status?: number })?.status;
      res.status(status && status >= 400 && status < 600 ? status : 500).json({ error: message });
    }
  });

  app.post('/api/replan', async (req, res) => {
    try {
      const body = req.body ?? {};
      const changeRequest = sanitizeText(body.changeRequest, 500);
      const currentPlan = body.currentPlan;

      if (!changeRequest) {
        res.status(400).json({ error: 'Please describe what changed so Shubh can replan.' });
        return;
      }
      if (!currentPlan || !currentPlan.brief || !Array.isArray(currentPlan.timeline)) {
        res.status(400).json({ error: 'Current event plan payload is required.' });
        return;
      }

      const ai = getGeminiClient();
      const prompt = [
        `You are Shubh, the AI event planner for Utsav AI.`,
        `The host just reported a real-world change to their event:`,
        `"${changeRequest}"`,
        ``,
        `Current Event Brief:`,
        JSON.stringify(currentPlan.brief),
        ``,
        `Current Timeline:`,
        JSON.stringify(currentPlan.timeline),
        ``,
        `Current Vendors:`,
        JSON.stringify(currentPlan.vendors),
        ``,
        `Current Budget Breakdown:`,
        JSON.stringify(currentPlan.budgetBreakdown),
        ``,
        `Current Reminders:`,
        JSON.stringify(currentPlan.reminders),
        ``,
        `Instructions:`,
        `Update the timeline, vendors, budgetBreakdown, and reminders to adapt cleanly to the reported change while preserving completed items ("Done") and booked vendors ("Booked") unless the change explicitly forces modifying them. Keep total budget allocation aligned with ${currentPlan.brief.budget} ${currentPlan.brief.currency} unless the change requests a budget shift.`,
      ].join('\n');

      const response = await generateWithRetry(() =>
        ai.models.generateContent({
          model: MODEL_NAME,
          contents: prompt,
          config: {
            systemInstruction:
              'You are Shubh, an adaptive celebration planner. Rebalance timelines, vendors, budgets, and guest reminders thoughtfully when disruptions occur.',
            responseMimeType: 'application/json',
            responseSchema: replanResponseSchema,
          },
        })
      );

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'Shubh returned an empty replan response. Please retry.' });
        return;
      }

      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to replan event.';
      const status = (err as { status?: number })?.status;
      res.status(status && status >= 400 && status < 600 ? status : 500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Utsav AI server running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
