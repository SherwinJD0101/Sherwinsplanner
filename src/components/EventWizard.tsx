import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import {
  EventCategory,
  EventProfile,
  EventStyle,
  FoodPreference,
  PriorityOption,
  UserProfile,
  VenueType,
  WeddingFunction,
} from '../types/event';
import {
  BUDGET_CATEGORIES,
  BUDGET_CATEGORY_COLORS,
  calculateBudgetSplit,
  calculateDaysToGo,
  formatINR,
  formatRsNumber,
  getTomorrowDateString,
} from '../utils/budget';
import { LotusDivider, MarigoldAccentIcon } from './IndianMotifs';

interface EventWizardProps {
  userProfile: UserProfile;
  initialEventType: EventCategory;
  existingProfile?: EventProfile | null;
  onComplete: (profile: EventProfile) => void;
  onCancelEdit?: () => void;
  onSignOut: () => void;
}

const EVENT_TYPE_OPTIONS: { type: EventCategory; subtitle: string }[] = [
  { type: 'Wedding', subtitle: 'Multi-day ceremonies & hospitality' },
  { type: 'Engagement', subtitle: 'Ring ceremony & cocktail dinner' },
  { type: 'Birthday', subtitle: 'Milestone celebration & party' },
  { type: 'Anniversary', subtitle: 'Golden-hour dinner & vows' },
  { type: 'Corporate Offsite', subtitle: 'Leadership retreat & gala' },
  { type: 'Baby Shower', subtitle: 'Godh Bharai & family brunch' },
  { type: 'Other', subtitle: 'Custom celebration or gathering' },
];

const WEDDING_FUNCTIONS: WeddingFunction[] = [
  'Haldi',
  'Mehendi',
  'Sangeet',
  'Wedding',
  'Reception',
];

const CITIES = [
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Jaipur',
  'Goa',
  'Udaipur',
  'Other',
];

const VENUE_TYPES: VenueType[] = [
  'Banquet Hall',
  'Hotel',
  'Outdoor/Lawn',
  'Beach',
  'Heritage Property',
  'Home',
];

const STYLE_OPTIONS: EventStyle[] = [
  'Traditional',
  'Modern',
  'Minimal',
  'Royal',
  'Boho',
  'Destination',
];

const FOOD_OPTIONS: FoodPreference[] = ['Veg', 'Non-veg', 'Both', 'Jain'];

const PRIORITY_OPTIONS: PriorityOption[] = [
  'Venue',
  'Food',
  'Decor',
  'Photography',
  'Entertainment',
  'Attire',
  'Guest Experience',
];

const STEP_LABELS = ['The Event', 'When & Where', 'Budget & Guests', 'Preferences'];

function getDefaultFutureDate(daysAhead = 65): string {
  const now = new Date();
  const future = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysAhead);
  const y = future.getFullYear();
  const m = String(future.getMonth() + 1).padStart(2, '0');
  const d = String(future.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function SvgDonutChart({
  percentages,
}: {
  percentages: Record<string, number>;
}) {
  const size = 210;
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Budget allocation donut chart"
        className="-rotate-90"
      >
        {BUDGET_CATEGORIES.map((category) => {
          const pct = percentages[category] ?? 0;
          const dashLength = (pct / 100) * circumference;
          const dashOffset = -((cumulativePercent / 100) * circumference);
          cumulativePercent += pct;

          return (
            <circle
              key={category}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={BUDGET_CATEGORY_COLORS[category]}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference}`}
              strokeDashoffset={dashOffset}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-[11px] font-medium text-[#57534E]">Total Split</span>
        <span className="font-mono text-lg font-semibold text-[#1C1917] tabular-nums">100%</span>
      </div>
    </div>
  );
}

export function EventWizard({
  userProfile,
  initialEventType,
  existingProfile,
  onComplete,
  onCancelEdit,
  onSignOut,
}: EventWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [eventType, setEventType] = useState<EventCategory>(
    existingProfile?.eventType ?? initialEventType
  );
  const [eventName, setEventName] = useState<string>(
    existingProfile?.eventName ??
      (initialEventType === 'Wedding'
        ? "Aarav & Meera's Wedding"
        : `My ${initialEventType} Celebration`)
  );
  const [hosts, setHosts] = useState<string>(
    existingProfile?.hosts ?? userProfile.name
  );
  const [numDays, setNumDays] = useState<number>(
    existingProfile?.numDays ?? (initialEventType === 'Wedding' ? 3 : 1)
  );
  const [functions, setFunctions] = useState<string[]>(
    existingProfile?.functions ??
      (initialEventType === 'Wedding' ? ['Haldi', 'Mehendi', 'Sangeet', 'Wedding', 'Reception'] : ['Main Celebration'])
  );

  const [date, setDate] = useState<string>(
    existingProfile?.date ?? getDefaultFutureDate(65)
  );
  const [city, setCity] = useState<string>(existingProfile?.city ?? 'Jaipur');
  const [venueType, setVenueType] = useState<VenueType>(
    existingProfile?.venueType ?? 'Heritage Property'
  );

  const [budget, setBudget] = useState<number>(existingProfile?.budget ?? 2400000);
  const [guestCount, setGuestCount] = useState<number>(
    existingProfile?.guestCount ?? 250
  );

  const [style, setStyle] = useState<EventStyle[]>(
    existingProfile?.style ?? ['Traditional', 'Royal']
  );
  const [food, setFood] = useState<FoodPreference>(
    existingProfile?.food ?? 'Veg'
  );
  const [priorities, setPriorities] = useState<PriorityOption[]>(
    existingProfile?.priorities ?? ['Venue', 'Food', 'Decor']
  );
  const [notes, setNotes] = useState<string>(existingProfile?.notes ?? '');

  const tomorrowStr = getTomorrowDateString();
  const daysToGo = calculateDaysToGo(date);
  const budgetPerGuest = guestCount > 0 ? budget / guestCount : 0;

  const { percentages, amounts } = useMemo(
    () => calculateBudgetSplit(eventType, budget, priorities),
    [eventType, budget, priorities]
  );

  const handleSelectEventType = (nextType: EventCategory) => {
    setEventType(nextType);
    if (!existingProfile) {
      setEventName(
        nextType === 'Wedding'
          ? "Aarav & Meera's Wedding"
          : `My ${nextType} Celebration`
      );
      setNumDays(nextType === 'Wedding' ? 3 : 1);
      setFunctions(
        nextType === 'Wedding'
          ? ['Haldi', 'Mehendi', 'Sangeet', 'Wedding', 'Reception']
          : ['Main Celebration']
      );
    }
  };

  const toggleWeddingFunction = (fn: WeddingFunction) => {
    setFunctions((prev) =>
      prev.includes(fn) ? prev.filter((item) => item !== fn) : [...prev, fn]
    );
  };

  const toggleStyle = (item: EventStyle) => {
    setStyle((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const togglePriority = (item: PriorityOption) => {
    setValidationError(null);
    setPriorities((prev) => {
      if (prev.includes(item)) {
        return prev.filter((p) => p !== item);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), item];
      }
      return [...prev, item];
    });
  };

  const handleNext = () => {
    setValidationError(null);
    if (step === 1) {
      if (!eventName.trim()) {
        setValidationError('Please enter an event name.');
        return;
      }
      if (!hosts.trim()) {
        setValidationError('Please enter host names.');
        return;
      }
      if (eventType === 'Wedding' && functions.length === 0) {
        setValidationError('Select at least one wedding function.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!date || date < tomorrowStr) {
        setValidationError('Event date must be in the future.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (budget < 50000 || budget > 10000000) {
        setValidationError('Total budget must be between Rs 50,000 and Rs 1,00,00,000.');
        return;
      }
      if (guestCount < 10 || guestCount > 2000) {
        setValidationError('Guest count must be between 10 and 2,000.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (style.length === 0) {
        setValidationError('Pick at least one celebration style.');
        return;
      }
      if (priorities.length !== 3) {
        setValidationError('Please select your top 3 priorities.');
        return;
      }
      setStep(5);
    }
  };

  const handleFinishAndGenerate = () => {
    const profile: EventProfile = {
      eventType,
      eventName: eventName.trim(),
      hosts: hosts.trim(),
      numDays: Math.max(1, numDays),
      functions:
        eventType === 'Wedding'
          ? functions
          : functions.length > 0
            ? functions
            : ['Main Celebration'],
      date,
      city,
      venueType,
      budget,
      guestCount,
      style,
      food,
      priorities,
      notes: notes.trim(),
      budgetSplit: amounts,
      createdAt: existingProfile?.createdAt ?? new Date().toISOString(),
    };
    localStorage.setItem('eventProfile', JSON.stringify(profile));
    onComplete(profile);
  };

  const progressPercent = step === 5 ? 100 : (step / 4) * 100;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917]">
      {/* Top Bar */}
      <header className="border-b border-[#E6DFD3] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <MarigoldAccentIcon />
            <span className="font-display text-2xl font-semibold text-[#064E3B]">
              Utsav AI
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:inline text-[#57534E]">
              Signed in as <strong className="font-medium text-[#1C1917]">{userProfile.name}</strong>
            </span>
            {onCancelEdit && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="rounded-lg border border-[#E6DFD3] px-3 py-1.5 font-medium text-[#1C1917] hover:bg-[#F4EFE6] cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={onSignOut}
              className="font-medium text-[#C2410C] hover:underline cursor-pointer"
            >
              Switch Account
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {/* Progress Header */}
        <div>
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-[#C2410C]">
              {step <= 4 ? `Step ${step} of 4 · ${STEP_LABELS[step - 1]}` : 'Review & Budget Split'}
            </span>
            <span className="font-mono text-[#57534E] tabular-nums">
              {Math.round(progressPercent)}%
            </span>
          </div>

          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-[#E6DFD3]">
            <div
              className="h-full rounded-full bg-[#064E3B] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2 text-[11px] text-[#57534E]">
            {STEP_LABELS.map((label, idx) => {
              const stepNum = idx + 1;
              const isDone = step > stepNum;
              const isCurrent = step === stepNum;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (stepNum < step) setStep(stepNum as 1 | 2 | 3 | 4);
                  }}
                  disabled={stepNum >= step}
                  className={`text-left truncate ${
                    isCurrent
                      ? 'font-semibold text-[#064E3B]'
                      : isDone
                        ? 'font-medium text-[#1C1917] cursor-pointer hover:underline'
                        : 'text-[#57534E]/70'
                  }`}
                >
                  {stepNum}. {label}
                </button>
              );
            })}
          </div>
        </div>

        {validationError && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-xs font-medium text-red-900"
          >
            {validationError}
          </div>
        )}

        {/* Wizard Card */}
        <div className="mt-6 rounded-2xl border border-[#E6DFD3] bg-white p-6 sm:p-9">
          {/* STEP 1: The Event */}
          {step === 1 && (
            <div className="space-y-7">
              <div>
                <h1 className="font-display text-2xl font-semibold text-[#1C1917] sm:text-3xl">
                  What are we celebrating?
                </h1>
                <p className="mt-1 text-sm text-[#57534E]">
                  Pick your occasion, name the event, and tell Shubh who is hosting.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917]">Event Type</label>
                <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {EVENT_TYPE_OPTIONS.map((opt) => {
                    const selected = eventType === opt.type;
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => handleSelectEventType(opt.type)}
                        className={`rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                          selected
                            ? 'border-[#064E3B] bg-[#064E3B] text-white shadow-sm'
                            : 'border-[#E6DFD3] bg-[#FBF9F5] text-[#1C1917] hover:border-[#064E3B]/40 hover:bg-[#F4EFE6]'
                        }`}
                      >
                        <p className="text-sm font-semibold">{opt.type}</p>
                        <p
                          className={`mt-0.5 text-xs ${
                            selected ? 'text-white/80' : 'text-[#57534E]'
                          }`}
                        >
                          {opt.subtitle}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="wizard-event-name" className="block text-xs font-semibold text-[#1C1917]">
                    Event Name
                  </label>
                  <input
                    id="wizard-event-name"
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g., Aarav & Meera's Wedding"
                    className="mt-1.5 w-full rounded-lg border border-[#E6DFD3] bg-[#FBF9F5] px-3.5 py-2.5 text-sm text-[#1C1917] focus:border-[#064E3B] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="wizard-hosts" className="block text-xs font-semibold text-[#1C1917]">
                    Host Names
                  </label>
                  <input
                    id="wizard-hosts"
                    type="text"
                    value={hosts}
                    onChange={(e) => setHosts(e.target.value)}
                    placeholder="e.g., Sharma & Kapoor Families"
                    className="mt-1.5 w-full rounded-lg border border-[#E6DFD3] bg-[#FBF9F5] px-3.5 py-2.5 text-sm text-[#1C1917] focus:border-[#064E3B] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-12">
                <div className="sm:col-span-4">
                  <label htmlFor="wizard-days" className="block text-xs font-semibold text-[#1C1917]">
                    Number of Days / Functions
                  </label>
                  <input
                    id="wizard-days"
                    type="number"
                    min={1}
                    max={14}
                    value={numDays}
                    onChange={(e) => setNumDays(Math.max(1, Math.min(14, Number(e.target.value))))}
                    className="mt-1.5 w-full rounded-lg border border-[#E6DFD3] bg-[#FBF9F5] px-3.5 py-2.5 font-mono text-sm text-[#1C1917] tabular-nums focus:border-[#064E3B] focus:bg-white focus:outline-none"
                  />
                </div>

                {eventType === 'Wedding' && (
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-semibold text-[#1C1917]">
                      Wedding Functions Included
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {WEDDING_FUNCTIONS.map((fn) => {
                        const active = functions.includes(fn);
                        return (
                          <button
                            key={fn}
                            type="button"
                            onClick={() => toggleWeddingFunction(fn)}
                            className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                              active
                                ? 'bg-[#C2410C] text-white'
                                : 'border border-[#E6DFD3] bg-[#FBF9F5] text-[#1C1917] hover:bg-[#F4EFE6]'
                            }`}
                          >
                            {fn}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: When & Where */}
          {step === 2 && (
            <div className="space-y-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-2xl font-semibold text-[#1C1917] sm:text-3xl">
                    When and where is it happening?
                  </h1>
                  <p className="mt-1 text-sm text-[#57534E]">
                    Select a future celebration date, city, and preferred venue format.
                  </p>
                </div>
                {date >= tomorrowStr && (
                  <div className="rounded-full border border-[#B8860B]/40 bg-[#F4EFE6] px-4 py-1.5 font-mono text-xs font-semibold text-[#064E3B] tabular-nums">
                    D-{daysToGo} to go
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="wizard-date" className="block text-xs font-semibold text-[#1C1917]">
                    Event Date (must be in the future)
                  </label>
                  <input
                    id="wizard-date"
                    type="date"
                    min={tomorrowStr}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setValidationError(null);
                    }}
                    className="mt-1.5 w-full rounded-lg border border-[#E6DFD3] bg-[#FBF9F5] px-3.5 py-2.5 font-mono text-sm text-[#1C1917] tabular-nums focus:border-[#064E3B] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="wizard-city" className="block text-xs font-semibold text-[#1C1917]">
                    City
                  </label>
                  <select
                    id="wizard-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[#E6DFD3] bg-[#FBF9F5] px-3.5 py-2.5 text-sm text-[#1C1917] focus:border-[#064E3B] focus:bg-white focus:outline-none"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917]">
                  Venue Type Preference
                </label>
                <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {VENUE_TYPES.map((vt) => {
                    const selected = venueType === vt;
                    return (
                      <button
                        key={vt}
                        type="button"
                        onClick={() => setVenueType(vt)}
                        className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors cursor-pointer ${
                          selected
                            ? 'border-[#064E3B] bg-[#064E3B] text-white'
                            : 'border-[#E6DFD3] bg-[#FBF9F5] text-[#1C1917] hover:bg-[#F4EFE6]'
                        }`}
                      >
                        {vt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Budget & Guests */}
          {step === 3 && (
            <div className="space-y-7">
              <div>
                <h1 className="font-display text-2xl font-semibold text-[#1C1917] sm:text-3xl">
                  Budget and guest estimate
                </h1>
                <p className="mt-1 text-sm text-[#57534E]">
                  Set your total celebration budget in INR and expected headcount.
                </p>
              </div>

              {/* Budget Slider + Number Input */}
              <div className="rounded-xl border border-[#E6DFD3] bg-[#FBF9F5] p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <label htmlFor="wizard-budget-input" className="text-xs font-semibold text-[#1C1917]">
                    Total Budget (INR)
                  </label>
                  <span className="font-display text-2xl font-semibold text-[#064E3B] tabular-nums">
                    {formatINR(budget)}
                  </span>
                </div>

                <input
                  type="range"
                  aria-label="Total budget slider"
                  min={50000}
                  max={10000000}
                  step={25000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="mt-4 w-full accent-[#C2410C] cursor-pointer"
                />

                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-[#57534E] tabular-nums">
                  <span>Rs 50,000</span>
                  <span>Rs 50,00,000</span>
                  <span>Rs 1,00,00,000</span>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs text-[#57534E]">Exact amount (INR):</span>
                  <input
                    id="wizard-budget-input"
                    type="number"
                    min={50000}
                    max={10000000}
                    step={5000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-44 rounded-lg border border-[#E6DFD3] bg-white px-3 py-2 font-mono text-sm text-[#1C1917] tabular-nums focus:border-[#064E3B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Guest Count */}
              <div className="rounded-xl border border-[#E6DFD3] bg-[#FBF9F5] p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <label htmlFor="wizard-guests-input" className="text-xs font-semibold text-[#1C1917]">
                    Expected Guest Count (10 to 2,000)
                  </label>
                  <span className="font-display text-2xl font-semibold text-[#1C1917] tabular-nums">
                    {guestCount} guests
                  </span>
                </div>

                <input
                  type="range"
                  aria-label="Expected guest count slider"
                  min={10}
                  max={2000}
                  step={5}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="mt-4 w-full accent-[#064E3B] cursor-pointer"
                />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#57534E]">Exact guests:</span>
                    <input
                      id="wizard-guests-input"
                      type="number"
                      min={10}
                      max={2000}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-32 rounded-lg border border-[#E6DFD3] bg-white px-3 py-2 font-mono text-sm text-[#1C1917] tabular-nums focus:border-[#064E3B] focus:outline-none"
                    />
                  </div>

                  <div className="rounded-lg border border-[#B8860B]/40 bg-white px-4 py-2 font-mono text-xs font-semibold text-[#C2410C] tabular-nums">
                    Budget per guest: {formatRsNumber(budgetPerGuest)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Preferences */}
          {step === 4 && (
            <div className="space-y-7">
              <div>
                <h1 className="font-display text-2xl font-semibold text-[#1C1917] sm:text-3xl">
                  Style, cuisine & top priorities
                </h1>
                <p className="mt-1 text-sm text-[#57534E]">
                  Pick your top 3 priorities so Shubh shifts +3% budget toward what matters most.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917]">
                  Celebration Style
                </label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {STYLE_OPTIONS.map((item) => {
                    const active = style.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleStyle(item)}
                        className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#064E3B] text-white'
                            : 'border border-[#E6DFD3] bg-[#FBF9F5] text-[#1C1917] hover:bg-[#F4EFE6]'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917]">
                  Food Preference
                </label>
                <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {FOOD_OPTIONS.map((item) => {
                    const active = food === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setFood(item)}
                        className={`rounded-lg border px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? 'border-[#C2410C] bg-[#C2410C] text-white'
                            : 'border-[#E6DFD3] bg-[#FBF9F5] text-[#1C1917] hover:bg-[#F4EFE6]'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#1C1917]">
                    Priority Ranking (Pick your top 3)
                  </label>
                  <span className="font-mono text-xs text-[#064E3B] tabular-nums">
                    {priorities.length}/3 selected
                  </span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {PRIORITY_OPTIONS.map((item) => {
                    const rankIndex = priorities.indexOf(item);
                    const active = rankIndex !== -1;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => togglePriority(item)}
                        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#064E3B] text-white'
                            : 'border border-[#E6DFD3] bg-[#FBF9F5] text-[#1C1917] hover:bg-[#F4EFE6]'
                        }`}
                      >
                        {active && (
                          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#FBBF24] font-mono text-[10px] font-bold text-[#1C1917]">
                            {rankIndex + 1}
                          </span>
                        )}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="wizard-notes" className="block text-xs font-semibold text-[#1C1917]">
                  Anything else Shubh should know?
                </label>
                <textarea
                  id="wizard-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special traditions, accessibility needs for elders, outstation hotel blocks, or music preferences..."
                  className="mt-1.5 w-full rounded-lg border border-[#E6DFD3] bg-[#FBF9F5] px-4 py-2.5 text-sm text-[#1C1917] focus:border-[#064E3B] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Summary Card & SVG Donut Chart */}
          {step === 5 && (
            <div className="space-y-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-[#C2410C]">Event Blueprint Summary</p>
                  <h1 className="mt-1 font-display text-2xl font-semibold text-[#1C1917] sm:text-3xl">
                    {eventName}
                  </h1>
                </div>
                <span className="rounded-full border border-[#B8860B]/40 bg-[#F4EFE6] px-4 py-1.5 font-mono text-xs font-semibold text-[#064E3B] tabular-nums">
                  D-{daysToGo} to go
                </span>
              </div>

              <LotusDivider />

              {/* Inputs Summary */}
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#E6DFD3] bg-[#FBF9F5] p-5 sm:grid-cols-2 lg:grid-cols-3 text-xs">
                <div>
                  <p className="text-[#57534E]">Occasion & Hosts</p>
                  <p className="mt-1 font-medium text-[#1C1917]">
                    {eventType} · {hosts}
                  </p>
                  <p className="mt-0.5 text-[#57534E]">
                    {numDays} day{numDays > 1 ? 's' : ''} · {functions.join(', ')}
                  </p>
                </div>
                <div>
                  <p className="text-[#57534E]">Date & Venue</p>
                  <p className="mt-1 font-mono font-medium text-[#1C1917] tabular-nums">{date}</p>
                  <p className="mt-0.5 text-[#57534E]">
                    {city} · {venueType}
                  </p>
                </div>
                <div>
                  <p className="text-[#57534E]">Budget & Guests</p>
                  <p className="mt-1 font-mono font-medium text-[#064E3B] tabular-nums">
                    {formatINR(budget)} ({guestCount} guests)
                  </p>
                  <p className="mt-0.5 font-mono text-[#57534E] tabular-nums">
                    {formatRsNumber(budgetPerGuest)} / guest
                  </p>
                </div>
                <div>
                  <p className="text-[#57534E]">Style & Food</p>
                  <p className="mt-1 font-medium text-[#1C1917]">{style.join(', ')}</p>
                  <p className="mt-0.5 text-[#57534E]">Cuisine: {food}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[#57534E]">Top 3 Priorities (+3% shift each)</p>
                  <p className="mt-1 font-medium text-[#1C1917]">
                    1. {priorities[0]} · 2. {priorities[1]} · 3. {priorities[2]}
                  </p>
                  {notes && <p className="mt-1 text-[#57534E]">Notes: {notes}</p>}
                </div>
              </div>

              {/* SVG Donut Chart + Budget Breakdown */}
              <div className="grid grid-cols-1 items-center gap-8 rounded-xl border border-[#E6DFD3] bg-white p-6 lg:grid-cols-12">
                <div className="flex flex-col items-center lg:col-span-5">
                  <SvgDonutChart percentages={percentages} />
                  <p className="mt-3 text-center text-xs text-[#57534E]">
                    Tailored {eventType} split with +3% priority weighting
                  </p>
                </div>

                <div className="lg:col-span-7">
                  <h2 className="font-display text-lg font-semibold text-[#1C1917]">
                    Recommended Budget Split
                  </h2>
                  <div className="mt-3 divide-y divide-[#F4EFE6]">
                    {BUDGET_CATEGORIES.map((category) => (
                      <div
                        key={category}
                        className="flex items-center justify-between gap-4 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="h-3 w-3 shrink-0 rounded-sm"
                            style={{ backgroundColor: BUDGET_CATEGORY_COLORS[category] }}
                            aria-hidden="true"
                          />
                          <span className="truncate font-medium text-[#1C1917]">{category}</span>
                        </div>
                        <div className="flex items-center gap-4 shrink-0 font-mono tabular-nums">
                          <span className="text-[#57534E]">{percentages[category]}%</span>
                          <span className="w-28 text-right font-semibold text-[#1C1917]">
                            {formatINR(amounts[category])}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Navigation Footer */}
          <div className="mt-8 flex items-center justify-between border-t border-[#E6DFD3] pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setValidationError(null);
                  setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-[#E6DFD3] bg-white px-5 py-2.5 text-sm font-medium text-[#1C1917] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-lg bg-[#064E3B] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#065F46] transition-colors cursor-pointer"
              >
                Continue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : step === 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-lg bg-[#064E3B] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#065F46] transition-colors cursor-pointer"
              >
                Review Budget Split
                <Check className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishAndGenerate}
                className="inline-flex items-center gap-2 rounded-lg bg-[#C2410C] px-7 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#9A3412] transition-colors cursor-pointer"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Generate My Plan
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
