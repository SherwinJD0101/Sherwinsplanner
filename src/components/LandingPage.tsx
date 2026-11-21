import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  CalendarClock,
  Store,
  Users,
  ShieldCheck,
  BellRing,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Menu,
  X,
  Check,
} from 'lucide-react';
import { EventCategory } from '../types/event';
import { LotusDivider, MandalaCorner, MarigoldAccentIcon } from './IndianMotifs';

interface LandingPageProps {
  onStartPlanning: (presetEventType?: EventCategory) => void;
}

const FEATURES = [
  {
    num: '01',
    title: 'Smart Timeline',
    description:
      'Shubh maps every ceremony, vendor deposit, and rehearsal backward from your event date with clear family and coordinator ownership.',
    detail: 'Auto-sequenced milestones',
    icon: CalendarClock,
  },
  {
    num: '02',
    title: 'Vendor Matchmaker',
    description:
      'Matched caterers, mandap decorators, photographers, and sound teams filtered by your city, guest count, and realistic spend ceiling.',
    detail: 'Budget-aligned shortlists',
    icon: Store,
  },
  {
    num: '03',
    title: 'RSVP Tracker',
    description:
      'Track households, plus-ones, dietary preferences, and outstation arrival counts in one structured guest ledger.',
    detail: 'Live headcount precision',
    icon: Users,
  },
  {
    num: '04',
    title: 'Budget Guardian',
    description:
      'Real-time category allocations guard against scope creep, surfacing hidden service charges before deposits are locked.',
    detail: 'Zero surprise overruns',
    icon: ShieldCheck,
  },
  {
    num: '05',
    title: 'Auto Reminders',
    description:
      'Timely WhatsApp, SMS, and email nudges remind guests to confirm RSVPs and alert vendors ahead of tasting and load-in dates.',
    detail: 'Hands-free follow-ups',
    icon: BellRing,
  },
  {
    num: '06',
    title: 'Instant Replanning',
    description:
      'Rain forecast, venue shift, or 40 extra guests? Tell Shubh what changed and watch your timeline, budget, and reminders rebalance.',
    detail: 'Adaptive contingency engine',
    icon: Sparkles,
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Tell us your event',
    description:
      'Share your occasion, city, date, guest estimate, and budget ceiling in under a minute.',
  },
  {
    step: '02',
    title: 'Get your plan',
    description:
      'Shubh builds a bespoke timeline, vendor shortlist, budget split, and starter guest reminders.',
  },
  {
    step: '03',
    title: 'Track everything',
    description:
      'Approve vendors, log deposits, and monitor confirmed guests from a single calm workspace.',
  },
  {
    step: '04',
    title: 'Shubh replans when life happens',
    description:
      'Report sudden weather shifts or headcount changes and receive a rebalanced plan immediately.',
  },
];

type LandingEventCategory = Exclude<EventCategory, 'Other'>;

const EVENT_PRESETS: Record<
  LandingEventCategory,
  {
    headline: string;
    typicalBudget: string;
    guestRange: string;
    highlights: string[];
    budgetFocus: string;
  }
> = {
  Wedding: {
    headline: 'Multi-day ceremonies coordinated without family stress',
    typicalBudget: '₹18,00,000 – ₹45,00,000',
    guestRange: '180 – 450 guests',
    highlights: [
      'Haldi, Mehendi, Sangeet & Pheras run-of-show',
      'Priest, mandap florist, catering & Baraat logistics',
      'Family hospitality & outstation rooming matrix',
    ],
    budgetFocus: '38% Venue & Hospitality · 28% Catering · 16% Decor · 18% Photo & Attire',
  },
  Engagement: {
    headline: 'Intimate ring ceremony with curated dining and portraits',
    typicalBudget: '₹4,50,000 – ₹12,00,000',
    guestRange: '80 – 180 guests',
    highlights: [
      'Stage backdrop, floral ring platter & acoustic entertainment',
      'Cocktail & plated chaat counter vendor matching',
      'Same-week RSVP confirmation reminders via WhatsApp',
    ],
    budgetFocus: '42% Venue & Dining · 22% Floral Stage · 20% Photo & Film · 16% Gifting',
  },
  Birthday: {
    headline: 'Milestone celebrations tailored to your venue and vibe',
    typicalBudget: '₹1,20,000 – ₹5,00,000',
    guestRange: '35 – 120 guests',
    highlights: [
      'Custom menu tasting, live dessert station & DJ timeline',
      'Return gift sourcing & kids or family activity zones',
      'Automated guest arrival reminders with location pin',
    ],
    budgetFocus: '45% Food & Beverage · 22% Decor & Theme · 18% Entertainment · 15% Photo',
  },
  Anniversary: {
    headline: 'Warm golden-hour dinners and family vow renewals',
    typicalBudget: '₹2,50,000 – ₹8,00,000',
    guestRange: '50 – 150 guests',
    highlights: [
      'Heritage courtyard seating with candlelit marigold styling',
      'Live sitar or jazz quartet booking and sound check schedule',
      'Memory tribute slideshow cue sheet and toast sequence',
    ],
    budgetFocus: '40% Heritage Venue & Dinner · 25% Ambience & Music · 20% Photo · 15% Keepsakes',
  },
  'Corporate Offsite': {
    headline: 'Seamless leadership retreats, townhalls, and gala dinners',
    typicalBudget: '₹8,00,000 – ₹25,00,000',
    guestRange: '60 – 250 attendees',
    highlights: [
      'AV rig, breakout room transitions & keynote speaker run-sheet',
      'Airport transfers, dietary-tagged catering & gala night awards',
      'Zero-overrun finance export for procurement sign-off',
    ],
    budgetFocus: '44% Resort & Conferencing · 26% Catering & Gala · 18% AV & Production · 12% Logistics',
  },
  'Baby Shower': {
    headline: 'Joyful daytime Godh Bharai and pastel botanical brunches',
    typicalBudget: '₹1,00,000 – ₹4,00,000',
    guestRange: '30 – 90 guests',
    highlights: [
      'Daytime marigold-and-lotus seating & shaded lawn plan',
      'Traditional ritual kit checklist & artisan mithai favors',
      'Gentle afternoon timing with elder-friendly seating layout',
    ],
    budgetFocus: '40% Brunch & Mithai · 28% Floral & Seating · 18% Photography · 14% Return Favors',
  },
};

const EVENT_CATEGORIES: LandingEventCategory[] = [
  'Wedding',
  'Engagement',
  'Birthday',
  'Anniversary',
  'Corporate Offsite',
  'Baby Shower',
];

const PRICING_TIERS = [
  {
    name: 'Free',
    audience: 'For intimate gatherings & single-day celebrations',
    price: '₹0',
    cadence: 'per event',
    highlighted: false,
    limits: [
      '1 active celebration workspace',
      'Up to 75 RSVP guest entries',
      'AI timeline & 6-category budget split',
      '3 instant replanning adjustments',
    ],
    cta: 'Start Planning',
  },
  {
    name: 'Pro',
    audience: 'For multi-day weddings & milestone celebrations',
    price: '₹1,999',
    cadence: 'per event',
    highlighted: true,
    limits: [
      'Multi-function timelines (Haldi to Reception)',
      'Up to 600 RSVP guests with dietary & travel tags',
      'Curated local vendor shortlists & quote tracking',
      'Unlimited Shubh instant replanning & WhatsApp reminders',
    ],
    cta: 'Start Planning',
  },
  {
    name: 'Planner Studio',
    audience: 'For boutique studios & full-service event agencies',
    price: '₹6,999',
    cadence: 'per month',
    highlighted: false,
    limits: [
      'Up to 15 concurrent client celebrations',
      'Unlimited guests, vendors & shared team owners',
      'Client-ready budget ledger & contingency logs',
      'Priority AI replanning across multi-city events',
    ],
    cta: 'Start Planning',
  },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Product Designer · Udaipur Wedding',
    eventContext: '3-day celebration · 310 guests',
    quote:
      'When unseasonal rain forced us to move our Mehendi indoors 36 hours out, Shubh rebalanced the marquee budget and sent updated hall timings to 140 households in minutes.',
    outcome: 'Saved ₹2,40,000 in last-minute rush fees',
    avatar: '/src/assets/images/avatar_priya_sharma_1795259806283.jpg',
    initials: 'PS',
  },
  {
    name: 'Rohan Mehta',
    role: 'VP Operations · Bengaluru',
    eventContext: 'Annual Leadership Offsite · 145 attendees',
    quote:
      'Instead of juggling four spreadsheets for AV vendors, dietary counts, and hotel transfers, our operations team tracked every single rupee inside Budget Guardian.',
    outcome: 'Closed event 4.2% under approved budget',
    avatar: '/src/assets/images/avatar_rohan_mehta_1795259806736.jpg',
    initials: 'RM',
  },
  {
    name: 'Ananya Kapoor',
    role: 'Founder, Marigold & Loom Studios · New Delhi',
    eventContext: 'Boutique Agency · 14 events managed',
    quote:
      'Shubh handles the structured groundwork—vendor follow-ups, milestone dates, and RSVP nudges—so my designers can spend their energy on florals and guest warmth.',
    outcome: 'Cut weekly coordination calls by 60%',
    avatar: '/src/assets/images/avatar_ananya_kapoor_1795259806445.jpg',
    initials: 'AK',
  },
];

function ImageWithFallback({
  src,
  alt,
  className,
  fallbackLabel,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#064E3B] via-[#065F46] to-[#9A3412] text-white/90 p-6 text-center ${className ?? ''}`}
      >
        <MarigoldAccentIcon className="mb-2" />
        <span className="font-display text-base font-medium">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function LandingPage({ onStartPlanning }: LandingPageProps) {
  const [selectedEvent, setSelectedEvent] = useState<LandingEventCategory>('Wedding');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const preset = EVENT_PRESETS[selectedEvent];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div id="top" className="min-h-screen bg-[#FBF9F5] text-[#1C1917]">
      {/* Sticky Top Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-40 border-b border-[#E6DFD3] bg-[#FBF9F5]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-3.5">
          {/* Zone 1: Single-element Brand Wordmark */}
          <a
            href="#top"
            className="font-display text-2xl font-semibold tracking-tight text-[#064E3B] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C2410C]"
          >
            Utsav AI
          </a>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57534E]"
          >
            <a
              href="#features"
              className="whitespace-nowrap shrink-0 hover:text-[#064E3B] hover:underline underline-offset-4 decoration-[#C2410C] transition-colors duration-150"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="whitespace-nowrap shrink-0 hover:text-[#064E3B] hover:underline underline-offset-4 decoration-[#C2410C] transition-colors duration-150"
            >
              How It Works
            </a>
            <a
              href="#events"
              className="whitespace-nowrap shrink-0 hover:text-[#064E3B] hover:underline underline-offset-4 decoration-[#C2410C] transition-colors duration-150"
            >
              Events
            </a>
            <a
              href="#pricing"
              className="whitespace-nowrap shrink-0 hover:text-[#064E3B] hover:underline underline-offset-4 decoration-[#C2410C] transition-colors duration-150"
            >
              Pricing
            </a>
            <a
              href="#reviews"
              className="whitespace-nowrap shrink-0 hover:text-[#064E3B] hover:underline underline-offset-4 decoration-[#C2410C] transition-colors duration-150"
            >
              Reviews
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onStartPlanning()}
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#C2410C] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#9A3412] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]"
            >
              Start Planning
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#E6DFD3] text-[#1C1917] hover:bg-[#F4EFE6] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E6DFD3] bg-[#FBF9F5] px-6 py-4 space-y-3">
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#1C1917]">
              <a href="#features" onClick={handleNavClick} className="py-2">
                Features
              </a>
              <a href="#how-it-works" onClick={handleNavClick} className="py-2">
                How It Works
              </a>
              <a href="#events" onClick={handleNavClick} className="py-2">
                Events
              </a>
              <a href="#pricing" onClick={handleNavClick} className="py-2">
                Pricing
              </a>
              <a href="#reviews" onClick={handleNavClick} className="py-2">
                Reviews
              </a>
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onStartPlanning();
              }}
              className="w-full rounded-lg bg-[#C2410C] px-5 py-3 text-sm font-medium text-white hover:bg-[#9A3412] cursor-pointer"
            >
              Start Planning
            </button>
          </div>
        )}
      </header>

      {/* Full-Viewport Hero */}
      <section className="relative overflow-hidden border-b border-[#E6DFD3]">
        <MandalaCorner className="pointer-events-none absolute top-0 left-0 opacity-70" />
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col justify-center px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Hero Left Copy */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-center lg:col-span-6"
            >
              <div className="mb-4 flex items-center gap-2.5 text-sm font-medium text-[#064E3B]">
                <MarigoldAccentIcon />
                <span>Celebration Intelligence · Guided by Shubh</span>
              </div>

              <h1
                className="font-display font-semibold tracking-tight text-[#1C1917] leading-[1.08]"
                style={{ fontSize: 'clamp(2.5rem, 4.4vw, 4.1rem)', textWrap: 'balance' }}
              >
                Plan Your Perfect Event with AI
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#57534E] sm:text-lg">
                Enter your budget, guests and date. Shubh, your AI planner, handles the rest.
              </p>

              {/* Two Hero CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onStartPlanning()}
                  className="inline-flex min-h-[48px] items-center gap-2.5 rounded-lg bg-[#C2410C] px-7 py-3.5 text-sm font-medium text-white shadow-sm hover:bg-[#9A3412] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]"
                >
                  Start Planning
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <a
                  href="#how-it-works"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[#064E3B]/30 bg-white px-6 py-3.5 text-sm font-medium text-[#064E3B] hover:border-[#064E3B] hover:bg-[#F4EFE6] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#064E3B]"
                >
                  See How Shubh Works
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>

              {/* Clean unboxed Hero Summary Row */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-[#E6DFD3] pt-7">
                <div>
                  <p className="font-mono text-xl font-medium text-[#064E3B] tabular-nums">6 Modules</p>
                  <p className="mt-1 text-xs text-[#57534E]">Timeline, vendors, budget & RSVPs</p>
                </div>
                <div>
                  <p className="font-mono text-xl font-medium text-[#064E3B] tabular-nums">60 Sec</p>
                  <p className="mt-1 text-xs text-[#57534E]">Complete plan from one brief</p>
                </div>
                <div>
                  <p className="font-mono text-xl font-medium text-[#064E3B] tabular-nums">Real-Time</p>
                  <p className="mt-1 text-xs text-[#57534E]">Instant replanning on disruption</p>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <div className="relative h-full min-h-[360px] lg:min-h-[520px] overflow-hidden rounded-2xl border border-[#E6DFD3] bg-[#064E3B] shadow-sm">
                <ImageWithFallback
                  src="/src/assets/images/hero_utsav_celebration_1795259806132.jpg"
                  alt="Indian wedding courtyard mandap decorated with emerald silk drapes, saffron marigolds, and brass diyas at dusk"
                  fallbackLabel="Utsav AI Festive Mandap"
                  className="h-full w-full object-cover lg:h-full"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-4">
                    <div>
                      <p className="font-display text-lg font-medium">Royal Courtyard Mandap</p>
                      <p className="text-xs text-white/80">
                        Jaipur Heritage Venue · 280 Guests · Budget Guarded
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onStartPlanning('Wedding')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-4 py-2 text-xs font-medium text-[#064E3B] hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Plan Similar Event
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6 Feature Cards */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <p className="text-sm font-medium text-[#C2410C]">Six Coordinated Modules</p>
          <h2
            className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#1C1917] sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Everything your celebration demands, organized by Shubh
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#57534E]">
            Replace fragmented spreadsheets, forgotten vendor calls, and last-minute budget surprises
            with one calm, living blueprint.
          </p>
        </motion.div>

        <LotusDivider className="my-10" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.38, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col justify-between rounded-xl border border-[#E6DFD3] bg-white p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B8860B]/60 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-[#B8860B] tabular-nums">
                      {feature.num}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4EFE6] text-[#064E3B] transition-colors duration-200 group-hover:bg-[#064E3B] group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-[#1C1917]">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#57534E]">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#F4EFE6] pt-4 text-xs font-medium text-[#064E3B]">
                  <span>{feature.detail}</span>
                  <button
                    type="button"
                    onClick={() => onStartPlanning()}
                    className="inline-flex items-center gap-1 text-[#C2410C] hover:underline underline-offset-4 cursor-pointer"
                  >
                    Try in planner
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Banquet Proof Split adjacent to Features */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 grid grid-cols-1 items-stretch overflow-hidden rounded-2xl border border-[#E6DFD3] bg-[#F4EFE6] lg:grid-cols-12"
        >
          <div className="lg:col-span-6 min-h-[280px]">
            <ImageWithFallback
              src="/src/assets/images/showcase_festive_banquet_1795259806447.jpg"
              alt="Upscale Indian celebration dining hall with emerald runners, brass lanterns, and marigold and white lotus centerpieces"
              fallbackLabel="Festive Banquet Coordination"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-6">
            <p className="text-xs font-medium text-[#064E3B]">
              Designed for Real Celebrations
            </p>
            <h3
              className="mt-2 font-display text-2xl font-semibold text-[#1C1917] sm:text-3xl"
              style={{ textWrap: 'balance' }}
            >
              From pheras at dawn to midnight sangeet encores
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#57534E]">
              Every vendor quote, guest dietary preference, and family checklist stays synchronized.
              When a caterer updates per-plate pricing or an aunt confirms four extra guests, Budget
              Guardian recalculates instantly.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => onStartPlanning()}
                className="inline-flex items-center gap-2 rounded-lg bg-[#064E3B] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#065F46] transition-colors cursor-pointer"
              >
                Open Shubh Workspace
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4-Step How-It-Works Strip */}
      <section
        id="how-it-works"
        className="relative overflow-hidden bg-[#064E3B] py-20 text-white lg:py-24"
      >
        <MandalaCorner
          className="pointer-events-none absolute -top-4 -right-4 rotate-90 opacity-60"
          stroke="rgba(212, 175, 55, 0.25)"
        />
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-[#FBBF24]">How It Works</p>
              <h2
                className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Four steps from first idea to effortless execution
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onStartPlanning()}
              className="inline-flex items-center gap-2 self-start rounded-lg bg-[#C2410C] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Start Planning
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <LotusDivider className="my-10" tone="light" />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col justify-between rounded-xl border border-white/15 bg-white/[0.04] p-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-medium text-[#FBBF24] tabular-nums">
                      {item.step}
                    </span>
                    {idx < HOW_IT_WORKS.length - 1 && (
                      <ChevronRight
                        className="hidden lg:block h-5 w-5 text-white/35"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/80">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Event-Type Chips */}
      <section id="events" className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium text-[#C2410C]">Tailored Playbooks</p>
          <h2
            className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#1C1917] sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Built for every milestone celebration
          </h2>
          <p className="mt-3 text-base text-[#57534E]">
            Select an occasion to inspect how Shubh structures timelines, vendors, and budgets.
          </p>
        </div>

        {/* Interactive Event-Type Filter Chips */}
        <div
          role="tablist"
          aria-label="Event types"
          className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
        >
          {EVENT_CATEGORIES.map((category) => {
            const active = selectedEvent === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedEvent(category)}
                className={`min-h-[42px] rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C] ${
                  active
                    ? 'bg-[#064E3B] text-white shadow-sm'
                    : 'border border-[#E6DFD3] bg-white text-[#1C1917] hover:border-[#064E3B]/40 hover:bg-[#F4EFE6]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Dynamic Event Preview Panel */}
        <motion.div
          key={selectedEvent}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 rounded-2xl border border-[#E6DFD3] bg-white p-8 sm:p-10"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-medium text-[#B8860B]">{selectedEvent} Blueprint</p>
              <h3 className="mt-1.5 font-display text-2xl font-semibold text-[#1C1917] sm:text-3xl">
                {preset.headline}
              </h3>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#57534E]">
                <span>
                  Typical Budget:{' '}
                  <strong className="font-mono font-medium text-[#1C1917] tabular-nums">
                    {preset.typicalBudget}
                  </strong>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Guest Scale:{' '}
                  <strong className="font-mono font-medium text-[#1C1917] tabular-nums">
                    {preset.guestRange}
                  </strong>
                </span>
              </div>

              <p className="mt-4 text-xs font-mono text-[#064E3B] tabular-nums">
                {preset.budgetFocus}
              </p>
            </div>

            <div className="lg:col-span-5 lg:border-l lg:border-[#E6DFD3] lg:pl-8">
              <ul className="space-y-3 text-sm text-[#1C1917]">
                {preset.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#064E3B]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => onStartPlanning(selectedEvent)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#C2410C] px-6 py-3 text-sm font-medium text-white hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Start Planning {selectedEvent}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3-Tier Pricing */}
      <section id="pricing" className="border-y border-[#E6DFD3] bg-[#F4EFE6]/65 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[#C2410C]">Transparent Plans</p>
            <h2
              className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#1C1917] sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Start free, scale when the guest list grows
            </h2>
            <p className="mt-3 text-base text-[#57534E]">
              Every tier includes Shubh AI plan generation. Upgrade only when you need multi-day
              coordination or studio scale.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col justify-between rounded-2xl p-8 transition-shadow duration-200 ${
                  tier.highlighted
                    ? 'border-2 border-[#064E3B] bg-white shadow-md'
                    : 'border border-[#E6DFD3] bg-white'
                }`}
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl font-semibold text-[#1C1917]">
                      {tier.name}
                    </h3>
                    {tier.highlighted && (
                      <span className="text-xs font-medium text-[#C2410C]">Most Popular</span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-[#57534E]">{tier.audience}</p>

                  <div className="mt-6 flex items-baseline gap-2 border-b border-[#E6DFD3] pb-6">
                    <span className="font-display text-4xl font-semibold text-[#1C1917] tabular-nums">
                      {tier.price}
                    </span>
                    <span className="text-sm text-[#57534E]">{tier.cadence}</span>
                  </div>

                  <ul className="mt-6 space-y-3.5 text-sm text-[#1C1917]">
                    {tier.limits.map((line) => (
                      <li key={line} className="flex items-start gap-2.5">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-[#064E3B]"
                          aria-hidden="true"
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => onStartPlanning()}
                    className={`w-full rounded-lg px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${
                      tier.highlighted
                        ? 'bg-[#C2410C] text-white hover:bg-[#9A3412]'
                        : 'border border-[#064E3B]/30 bg-[#FBF9F5] text-[#064E3B] hover:bg-[#064E3B] hover:text-white'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Testimonial Cards */}
      <section id="reviews" className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#C2410C]">Hosted with Utsav AI</p>
          <h2
            className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#1C1917] sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Trusted by families, operations leads, and celebration studios
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((item, idx) => (
            <motion.blockquote
              key={item.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.38, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between rounded-2xl border border-[#E6DFD3] bg-white p-7"
            >
              <div>
                <p className="text-xs font-medium text-[#B8860B]">{item.eventContext}</p>
                <p className="mt-4 text-sm leading-relaxed text-[#1C1917]">“{item.quote}”</p>
              </div>

              <div className="mt-6 border-t border-[#F4EFE6] pt-5">
                <p className="text-xs font-medium text-[#064E3B]">{item.outcome}</p>
                <div className="mt-4 flex items-center gap-3.5">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#E6DFD3] bg-[#F4EFE6]">
                    <ImageWithFallback
                      src={item.avatar}
                      alt={item.name}
                      fallbackLabel={item.initials}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#1C1917]">{item.name}</p>
                    <p className="truncate text-xs text-[#57534E]">{item.role}</p>
                  </div>
                </div>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-[#064E3B] px-8 py-14 text-white sm:px-14">
          <MandalaCorner
            className="pointer-events-none absolute -bottom-6 -right-6 rotate-180 opacity-60"
            stroke="rgba(251, 191, 36, 0.25)"
          />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[#FBBF24]">Ready When You Are</p>
              <h2
                className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
                style={{ textWrap: 'balance' }}
              >
                Bring calm precision to your next celebration
              </h2>
              <p className="mt-3 text-base text-white/80">
                Share your date, guest count, and budget. Shubh prepares your full timeline, vendor
                matches, and live budget ledger in seconds.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onStartPlanning()}
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-lg bg-[#C2410C] px-7 py-3.5 text-sm font-medium text-white shadow-sm hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Start Planning
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* 4-Column Footer */}
      <footer className="border-t border-[#E6DFD3] bg-[#F4EFE6]/70">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1 */}
            <div>
              <a href="#top" className="font-display text-2xl font-semibold text-[#064E3B]">
                Utsav AI
              </a>
              <p className="mt-3 text-sm leading-relaxed text-[#57534E]">
                Intelligent celebration planning crafted for weddings, family milestones, and
                corporate gatherings.
              </p>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="text-sm font-semibold text-[#1C1917]">Platform</h3>
              <ul className="mt-3.5 space-y-2.5 text-sm text-[#57534E]">
                <li>
                  <a href="#features" className="hover:text-[#064E3B]">
                    Smart Timeline
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#064E3B]">
                    Vendor Matchmaker
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#064E3B]">
                    RSVP Tracker
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-[#064E3B]">
                    Budget Guardian
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="text-sm font-semibold text-[#1C1917]">Celebrations</h3>
              <ul className="mt-3.5 space-y-2.5 text-sm text-[#57534E]">
                <li>
                  <button
                    type="button"
                    onClick={() => onStartPlanning('Wedding')}
                    className="hover:text-[#064E3B] cursor-pointer"
                  >
                    Weddings
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onStartPlanning('Engagement')}
                    className="hover:text-[#064E3B] cursor-pointer"
                  >
                    Engagements
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onStartPlanning('Corporate Offsite')}
                    className="hover:text-[#064E3B] cursor-pointer"
                  >
                    Corporate Offsites
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onStartPlanning('Baby Shower')}
                    className="hover:text-[#064E3B] cursor-pointer"
                  >
                    Baby Showers & Birthdays
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="text-sm font-semibold text-[#1C1917]">Get Started</h3>
              <ul className="mt-3.5 space-y-2.5 text-sm text-[#57534E]">
                <li>
                  <a href="#how-it-works" className="hover:text-[#064E3B]">
                    How Shubh Works
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-[#064E3B]">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#reviews" className="hover:text-[#064E3B]">
                    Client Stories
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onStartPlanning()}
                    className="font-medium text-[#C2410C] hover:underline cursor-pointer"
                  >
                    Start Planning
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#E6DFD3] pt-6 text-xs text-[#57534E] sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} Utsav AI. Crafted for joyful celebrations.</p>
            <p>Shubh AI Planning Workspace</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
