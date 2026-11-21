import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  CalendarClock,
  IndianRupee,
  LayoutDashboard,
  LogOut,
  Pencil,
  Sparkles,
  Store,
  Users,
} from 'lucide-react';
import { EventProfile, UserProfile } from '../types/event';
import {
  BUDGET_CATEGORIES,
  calculateDaysToGo,
  formatINR,
} from '../utils/budget';
import { LotusDivider, MarigoldAccentIcon } from './IndianMotifs';

interface PlannerWorkspaceProps {
  userProfile: UserProfile;
  eventProfile: EventProfile;
  onEditEvent: () => void;
  onSignOut: () => void;
  onBackToLanding: () => void;
}

type AppTab = 'Dashboard' | 'Timeline' | 'Vendors' | 'Guests' | 'Budget' | 'Shubh AI';

const TABS: { id: AppTab; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: 'Dashboard', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard },
  { id: 'Timeline', label: 'Timeline', shortLabel: 'Timeline', icon: CalendarClock },
  { id: 'Vendors', label: 'Vendors', shortLabel: 'Vendors', icon: Store },
  { id: 'Guests', label: 'Guests', shortLabel: 'Guests', icon: Users },
  { id: 'Budget', label: 'Budget', shortLabel: 'Budget', icon: IndianRupee },
  { id: 'Shubh AI', label: 'Shubh AI', shortLabel: 'Shubh', icon: Sparkles },
];

interface PlaceholderBox {
  title: string;
  description: string;
  meta?: string;
  span?: string;
}

const REMINDER_ITEMS = [
  { id: '1', text: 'Finalize venue walkthrough & layout', due: 'Upcoming · Venue' },
  { id: '2', text: 'Send save-the-date & RSVP link', due: 'Upcoming · Guests' },
  { id: '3', text: 'Review catering menu shortlist', due: 'Upcoming · Catering' },
];

export function PlannerWorkspace({
  userProfile,
  eventProfile,
  onEditEvent,
  onSignOut,
  onBackToLanding,
}: PlannerWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<AppTab>('Dashboard');
  const [remindersOpen, setRemindersOpen] = useState(false);
  const bellWrapperRef = useRef<HTMLDivElement>(null);

  const daysToGo = calculateDaysToGo(eventProfile.date);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        bellWrapperRef.current &&
        !bellWrapperRef.current.contains(event.target as Node)
      ) {
        setRemindersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const tabConfig: Record<
    AppTab,
    {
      subtitle: string;
      boxes: PlaceholderBox[];
    }
  > = {
    Dashboard: {
      subtitle: `${eventProfile.city} · ${eventProfile.venueType} · Hosted by ${eventProfile.hosts}`,
      boxes: [
        {
          title: 'Countdown',
          description: 'Days, hours, and upcoming ceremony checkpoints.',
          meta: `D-${daysToGo} to go · ${eventProfile.date}`,
          span: 'lg:col-span-4',
        },
        {
          title: 'Plan Health',
          description: 'Overall readiness score across tasks, vendors, and budget.',
          meta: `${eventProfile.functions.length} function${eventProfile.functions.length > 1 ? 's' : ''} configured`,
          span: 'lg:col-span-4',
        },
        {
          title: 'Upcoming Tasks',
          description: 'Next priority actions due this week.',
          meta: `Priorities: ${eventProfile.priorities.join(', ')}`,
          span: 'lg:col-span-4',
        },
        {
          title: 'Budget Snapshot',
          description: 'Total budget, committed deposits, and remaining headroom.',
          meta: `Target: ${formatINR(eventProfile.budget)}`,
          span: 'lg:col-span-6',
        },
        {
          title: 'RSVP Snapshot',
          description: 'Confirmed, pending, and declined household counts.',
          meta: `Expected: ${eventProfile.guestCount} guests · ${eventProfile.food}`,
          span: 'lg:col-span-6',
        },
      ],
    },
    Timeline: {
      subtitle: `Sequenced milestones for ${eventProfile.numDays} day${eventProfile.numDays > 1 ? 's' : ''} (${eventProfile.functions.join(', ')}).`,
      boxes: [
        {
          title: 'Month-by-Month Timeline',
          description: 'Chronological milestones mapped backward from your celebration date.',
          meta: `Target Date: ${eventProfile.date}`,
          span: 'lg:col-span-12',
        },
        {
          title: 'Checklist',
          description: 'Filterable task list with family and coordinator assignments.',
          span: 'lg:col-span-7',
        },
        {
          title: 'Overdue Tasks',
          description: 'Past-due commitments flagged for immediate follow-up.',
          span: 'lg:col-span-5',
        },
      ],
    },
    Vendors: {
      subtitle: `Matched ${eventProfile.city} hospitality, decor, catering, and photography partners.`,
      boxes: [
        {
          title: 'Suggested Vendors',
          description: 'AI-curated local vendors aligned to your guest count and budget.',
          meta: `${eventProfile.venueType} · ${eventProfile.style.join(', ')}`,
          span: 'lg:col-span-12',
        },
        {
          title: 'Shortlist',
          description: 'Saved quotes and side-by-side package comparisons.',
          span: 'lg:col-span-6',
        },
        {
          title: 'Booked',
          description: 'Confirmed contracts, advance receipts, and load-in contacts.',
          span: 'lg:col-span-6',
        },
      ],
    },
    Guests: {
      subtitle: `Managing ${eventProfile.guestCount} expected guests with ${eventProfile.food} cuisine preferences.`,
      boxes: [
        {
          title: 'Guest List',
          description: 'Searchable directory of households, sides, and party sizes.',
          span: 'lg:col-span-12',
        },
        {
          title: 'RSVP Summary',
          description: 'Attendance breakdown by ceremony and dietary preference.',
          span: 'lg:col-span-6',
        },
        {
          title: 'Send Invites',
          description: 'Digital invite links and WhatsApp / Email RSVP reminders.',
          span: 'lg:col-span-6',
        },
      ],
    },
    Budget: {
      subtitle: `Total budget ${formatINR(eventProfile.budget)} weighted toward ${eventProfile.priorities.join(', ')}.`,
      boxes: [
        {
          title: 'Budget Split',
          description: 'Planned allocation across all 8 celebration categories.',
          meta: BUDGET_CATEGORIES.slice(0, 4)
            .map((cat) => `${cat}: ${formatINR(eventProfile.budgetSplit[cat] ?? 0)}`)
            .join(' · '),
          span: 'lg:col-span-12',
        },
        {
          title: 'Expenses',
          description: 'Recorded deposits and itemized vendor invoices.',
          span: 'lg:col-span-6',
        },
        {
          title: 'Payments Due',
          description: 'Scheduled milestone installments and upcoming due dates.',
          span: 'lg:col-span-6',
        },
      ],
    },
    'Shubh AI': {
      subtitle: 'Your AI planning partner for guidance and real-time contingency adjustments.',
      boxes: [
        {
          title: 'Chat with Shubh',
          description: 'Ask etiquette, ritual timing, or vendor negotiation questions anytime.',
          span: 'lg:col-span-6',
        },
        {
          title: 'What Changed? Replan',
          description: 'Report weather shifts, guest jumps, or budget edits to rebalance your plan.',
          span: 'lg:col-span-6',
        },
      ],
    },
  };

  const currentTabConfig = tabConfig[activeTab];

  return (
    <div className="flex min-h-screen flex-col bg-[#FBF9F5] text-[#1C1917] md:flex-row">
      {/* Desktop Left Sidebar Nav */}
      <aside className="hidden md:flex md:w-[252px] md:shrink-0 md:flex-col md:justify-between border-r border-[#E6DFD3] bg-[#F4EFE6]/70">
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBackToLanding}
              className="font-display text-2xl font-semibold tracking-tight text-[#064E3B] whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]"
            >
              Utsav AI
            </button>
            <button
              type="button"
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-[#57534E] hover:bg-white hover:text-[#1C1917] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Home
            </button>
          </div>

          <div className="mt-6 border-t border-[#E6DFD3] pt-5">
            <p className="px-2 text-[11px] font-medium text-[#57534E]">
              {eventProfile.eventType} Workspace
            </p>

            <nav aria-label="Workspace navigation" className="mt-2.5 space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C] ${
                      isActive
                        ? 'bg-[#064E3B] text-white shadow-sm'
                        : 'text-[#1C1917] hover:bg-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="m-5 space-y-3">
          <div className="rounded-xl border border-[#E6DFD3] bg-white p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#064E3B]">
              <MarigoldAccentIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">{userProfile.name}</span>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-[#57534E]">{userProfile.email}</p>
            <button
              type="button"
              onClick={onSignOut}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#C2410C] hover:underline cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 border-b border-[#E6DFD3] bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={onBackToLanding}
                aria-label="Back to landing page"
                className="md:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E6DFD3] bg-[#FBF9F5] text-[#1C1917] hover:bg-[#F4EFE6] cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate font-display text-lg font-semibold text-[#1C1917] sm:text-xl">
                  {eventProfile.eventName}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Working Countdown Pill */}
              <div className="inline-flex items-center rounded-full border border-[#B8860B]/40 bg-[#F4EFE6] px-3.5 py-1.5 font-mono text-xs font-medium text-[#064E3B] tabular-nums whitespace-nowrap shrink-0">
                D-{daysToGo} to go
              </div>

              {/* Bell Icon for Reminders */}
              <div ref={bellWrapperRef} className="relative">
                <button
                  type="button"
                  onClick={() => setRemindersOpen((prev) => !prev)}
                  aria-label="Toggle upcoming reminders"
                  aria-expanded={remindersOpen}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E6DFD3] bg-[#FBF9F5] text-[#1C1917] hover:border-[#064E3B]/40 hover:bg-[#F4EFE6] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]"
                >
                  <Bell className="h-4 w-4" aria-hidden="true" />
                </button>

                {remindersOpen && (
                  <div
                    role="region"
                    aria-label="Reminders"
                    className="absolute right-0 mt-2 w-72 rounded-xl border border-[#E6DFD3] bg-white p-4 shadow-lg z-50"
                  >
                    <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-2.5">
                      <p className="text-xs font-semibold text-[#1C1917]">Upcoming Reminders</p>
                      <span className="font-mono text-[11px] text-[#B8860B] tabular-nums">
                        {REMINDER_ITEMS.length} queued
                      </span>
                    </div>
                    <ul className="mt-2.5 space-y-2.5">
                      {REMINDER_ITEMS.map((rem) => (
                        <li
                          key={rem.id}
                          className="rounded-lg bg-[#FBF9F5] p-2.5 text-xs border border-[#F4EFE6]"
                        >
                          <p className="font-medium text-[#1C1917]">{rem.text}</p>
                          <p className="mt-0.5 font-mono text-[11px] text-[#57534E] tabular-nums">
                            {rem.due}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('Timeline');
                        setRemindersOpen(false);
                      }}
                      className="mt-3 w-full rounded-lg bg-[#064E3B] px-3 py-2 text-xs font-medium text-white hover:bg-[#065F46] transition-colors cursor-pointer"
                    >
                      View in Timeline
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Active Tab Viewport (Only one tab visible at a time) */}
        <main className="flex-1 px-4 py-7 pb-24 sm:px-8 md:pb-10">
          <div className="mx-auto max-w-6xl">
            {/* Tab Heading + Edit Event button on Dashboard */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#C2410C]">
                  {eventProfile.eventType} Planner
                </p>
                <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-[#1C1917]">
                  {activeTab}
                </h2>
                <p className="mt-1.5 text-sm text-[#57534E]">{currentTabConfig.subtitle}</p>
              </div>

              {activeTab === 'Dashboard' && (
                <button
                  type="button"
                  onClick={onEditEvent}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#064E3B]/30 bg-white px-4 py-2.5 text-xs font-medium text-[#064E3B] hover:border-[#064E3B] hover:bg-[#F4EFE6] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  Edit Event
                </button>
              )}
            </div>

            <LotusDivider className="my-6" />

            {/* Dashed-Border Placeholder Boxes */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              {currentTabConfig.boxes.map((box) => (
                <div
                  key={box.title}
                  className={`flex min-h-[190px] flex-col justify-between rounded-xl border-2 border-dashed border-[#D6CFC2] bg-white/80 p-6 transition-colors hover:border-[#B8860B]/70 ${
                    box.span ?? 'lg:col-span-6'
                  }`}
                >
                  <div>
                    <h3 className="font-display text-xl font-semibold text-[#1C1917]">
                      {box.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#57534E]">{box.description}</p>
                  </div>
                  <div className="mt-6 border-t border-dashed border-[#E6DFD3] pt-3 text-xs font-medium text-[#064E3B]">
                    {box.meta ? (
                      <span className="font-mono tabular-nums">{box.meta}</span>
                    ) : (
                      <span>Module ready for {activeTab.toLowerCase()} data</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <nav
        aria-label="Mobile workspace navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-[#E6DFD3] bg-white/95 backdrop-blur-md md:hidden"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isActive ? 'text-[#C2410C]' : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate max-w-full">{tab.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
