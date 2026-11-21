export type EventCategory =
  | 'Wedding'
  | 'Engagement'
  | 'Birthday'
  | 'Anniversary'
  | 'Corporate Offsite'
  | 'Baby Shower'
  | 'Other';

export type CurrencyCode = 'INR' | 'USD';

export interface UserProfile {
  name: string;
  email: string;
}

export type WeddingFunction = 'Haldi' | 'Mehendi' | 'Sangeet' | 'Wedding' | 'Reception';

export type VenueType =
  | 'Banquet Hall'
  | 'Hotel'
  | 'Outdoor/Lawn'
  | 'Beach'
  | 'Heritage Property'
  | 'Home';

export type EventStyle =
  | 'Traditional'
  | 'Modern'
  | 'Minimal'
  | 'Royal'
  | 'Boho'
  | 'Destination';

export type FoodPreference = 'Veg' | 'Non-veg' | 'Both' | 'Jain';

export type PriorityOption =
  | 'Venue'
  | 'Food'
  | 'Decor'
  | 'Photography'
  | 'Entertainment'
  | 'Attire'
  | 'Guest Experience';

export type BudgetCategoryName =
  | 'Venue'
  | 'Catering'
  | 'Decor'
  | 'Photography'
  | 'Attire & Jewellery'
  | 'Entertainment'
  | 'Invitations & Gifts'
  | 'Contingency';

export interface EventProfile {
  eventType: EventCategory;
  eventName: string;
  hosts: string;
  numDays: number;
  functions: string[];
  date: string;
  city: string;
  venueType: VenueType;
  budget: number;
  guestCount: number;
  style: EventStyle[];
  food: FoodPreference;
  priorities: PriorityOption[];
  notes: string;
  budgetSplit: Record<BudgetCategoryName, number>;
  createdAt: string;
}

export interface EventBrief {
  eventType: EventCategory;
  eventName: string;
  budget: number;
  currency: CurrencyCode;
  guestCount: number;
  eventDate: string;
  city: string;
  styleNotes: string;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Done';

export interface TimelineItem {
  id: string;
  phase: string;
  title: string;
  dueDate: string;
  owner: string;
  status: TaskStatus;
}

export type VendorStatus = 'Recommended' | 'Shortlisted' | 'Booked';

export interface VendorItem {
  id: string;
  category: string;
  vendorName: string;
  specialty: string;
  estimatedCost: number;
  locationNote: string;
  status: VendorStatus;
}

export type RsvpStatus = 'Confirmed' | 'Pending' | 'Declined';

export interface RsvpGuest {
  id: string;
  guestName: string;
  group: string;
  partySize: number;
  dietary: string;
  rsvpStatus: RsvpStatus;
}

export interface BudgetCategory {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  notes: string;
}

export type ReminderChannel = 'WhatsApp' | 'Email' | 'SMS';
export type ReminderStatus = 'Scheduled' | 'Sent';

export interface ReminderItem {
  id: string;
  title: string;
  channel: ReminderChannel;
  scheduledFor: string;
  recipientGroup: string;
  status: ReminderStatus;
}

export interface EventPlan {
  brief: EventBrief;
  shubhSummary: string;
  timeline: TimelineItem[];
  vendors: VendorItem[];
  budgetBreakdown: BudgetCategory[];
  rsvps: RsvpGuest[];
  reminders: ReminderItem[];
}

export interface ReplanResponse {
  shubhNote: string;
  changesSummary: string[];
  timeline: TimelineItem[];
  vendors: VendorItem[];
  budgetBreakdown: BudgetCategory[];
  reminders: ReminderItem[];
}
