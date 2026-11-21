import {
  BudgetCategoryName,
  EventCategory,
  PriorityOption,
} from '../types/event';

export const BUDGET_CATEGORIES: BudgetCategoryName[] = [
  'Venue',
  'Catering',
  'Decor',
  'Photography',
  'Attire & Jewellery',
  'Entertainment',
  'Invitations & Gifts',
  'Contingency',
];

export const BUDGET_CATEGORY_COLORS: Record<BudgetCategoryName, string> = {
  Venue: '#064E3B',
  Catering: '#C2410C',
  Decor: '#D97706',
  Photography: '#B8860B',
  'Attire & Jewellery': '#0D9488',
  Entertainment: '#9A3412',
  'Invitations & Gifts': '#15803D',
  Contingency: '#78716C',
};

const BASE_SPLITS: Record<EventCategory, Record<BudgetCategoryName, number>> = {
  Wedding: {
    Venue: 25,
    Catering: 30,
    Decor: 12,
    Photography: 8,
    'Attire & Jewellery': 10,
    Entertainment: 5,
    'Invitations & Gifts': 4,
    Contingency: 6,
  },
  Engagement: {
    Venue: 26,
    Catering: 32,
    Decor: 14,
    Photography: 10,
    'Attire & Jewellery': 6,
    Entertainment: 5,
    'Invitations & Gifts': 3,
    Contingency: 4,
  },
  Birthday: {
    Venue: 22,
    Catering: 34,
    Decor: 16,
    Photography: 8,
    'Attire & Jewellery': 3,
    Entertainment: 10,
    'Invitations & Gifts': 4,
    Contingency: 3,
  },
  Anniversary: {
    Venue: 26,
    Catering: 32,
    Decor: 13,
    Photography: 9,
    'Attire & Jewellery': 5,
    Entertainment: 7,
    'Invitations & Gifts': 4,
    Contingency: 4,
  },
  'Corporate Offsite': {
    Venue: 30,
    Catering: 30,
    Decor: 8,
    Photography: 6,
    'Attire & Jewellery': 2,
    Entertainment: 12,
    'Invitations & Gifts': 5,
    Contingency: 7,
  },
  'Baby Shower': {
    Venue: 22,
    Catering: 32,
    Decor: 18,
    Photography: 9,
    'Attire & Jewellery': 4,
    Entertainment: 6,
    'Invitations & Gifts': 5,
    Contingency: 4,
  },
  Other: {
    Venue: 25,
    Catering: 30,
    Decor: 14,
    Photography: 8,
    'Attire & Jewellery': 4,
    Entertainment: 8,
    'Invitations & Gifts': 5,
    Contingency: 6,
  },
};

const PRIORITY_TO_CATEGORY: Record<PriorityOption, BudgetCategoryName> = {
  Venue: 'Venue',
  Food: 'Catering',
  Decor: 'Decor',
  Photography: 'Photography',
  Entertainment: 'Entertainment',
  Attire: 'Attire & Jewellery',
  'Guest Experience': 'Invitations & Gifts',
};

export function calculateBudgetSplit(
  eventType: EventCategory,
  totalBudget: number,
  priorities: PriorityOption[]
): {
  percentages: Record<BudgetCategoryName, number>;
  amounts: Record<BudgetCategoryName, number>;
} {
  const base = { ...BASE_SPLITS[eventType] };
  const boostedCategories = new Set(
    priorities.slice(0, 3).map((p) => PRIORITY_TO_CATEGORY[p])
  );

  const boostedCount = boostedCategories.size;
  const nonBoostedCategories = BUDGET_CATEGORIES.filter(
    (cat) => !boostedCategories.has(cat)
  );

  const rawPercentages: Record<BudgetCategoryName, number> = { ...base };

  if (boostedCount > 0 && nonBoostedCategories.length > 0) {
    const totalShift = boostedCount * 3;
    const deductionPerOther = totalShift / nonBoostedCategories.length;

    for (const cat of boostedCategories) {
      rawPercentages[cat] = base[cat] + 3;
    }
    for (const cat of nonBoostedCategories) {
      rawPercentages[cat] = Math.max(0.5, base[cat] - deductionPerOther);
    }
  }

  // Normalize so sum is exactly 100%
  const rawSum = BUDGET_CATEGORIES.reduce((acc, cat) => acc + rawPercentages[cat], 0);
  const percentages = {} as Record<BudgetCategoryName, number>;
  for (const cat of BUDGET_CATEGORIES) {
    percentages[cat] = Number(((rawPercentages[cat] / rawSum) * 100).toFixed(1));
  }

  // Convert to exact integer INR amounts summing to totalBudget
  const amounts = {} as Record<BudgetCategoryName, number>;
  let allocatedSoFar = 0;
  BUDGET_CATEGORIES.forEach((cat, idx) => {
    if (idx === BUDGET_CATEGORIES.length - 1) {
      amounts[cat] = Math.max(0, Math.round(totalBudget - allocatedSoFar));
    } else {
      const amt = Math.round((percentages[cat] / 100) * totalBudget);
      amounts[cat] = amt;
      allocatedSoFar += amt;
    }
  });

  return { percentages, amounts };
}

export function calculateDaysToGo(dateString: string): number {
  if (!dateString) return 0;
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return 0;
  const target = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = target.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export function getTomorrowDateString(): string {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const y = tomorrow.getFullYear();
  const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const d = String(tomorrow.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatRsNumber(amount: number): string {
  return `Rs ${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount))}`;
}
