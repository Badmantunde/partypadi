export type EventCategory =
  | "all"
  | "parties"
  | "concerts"
  | "dinners"
  | "department-week"
  | "cultural"
  | "networking";

export interface TicketTier {
  id: string;
  name: string;
  price: number; // in NGN (0 for free)
  description: string;
  badge?: string;
  available: boolean;
}

export interface CampusEvent {
  id: string;
  title: string;
  subtitle: string;
  category: EventCategory;
  categoryLabel: string;
  date: string; // e.g. "Fri, 24 Oct 2026"
  shortDate: string; // e.g. "24 OCT"
  time: string; // e.g. "19:00 WAT"
  venue: string;
  campus: string; // e.g. "Main Campus"
  fullLocation: string; // e.g. "Mini Stadium Lawn, Central Campus"
  priceStartingFrom: number;
  isFree?: boolean;
  statusBadge?: "Selling Fast" | "Campus Pick" | "Almost Gone" | "Free Entry" | "Exclusive";
  organizer: {
    name: string;
    role: string;
    verified: boolean;
    avatar?: string;
  };
  imageUrl: string;
  fallbackGradient: string;
  description: string;
  highlights: string[];
  lineup?: string[];
  dressCode?: string;
  ticketTiers: TicketTier[];
}

export interface CampusOption {
  id: string;
  name: string;
  shortName: string;
  location: string;
  status: "active" | "coming_soon";
  eventCount: number;
}

export interface AdditionalAttendee {
  fullName?: string;
  email: string;
}

export interface BookingDetails {
  eventId: string;
  tierId: string;
  quantity: number;
  fullName: string;
  email: string;
  phone: string;
  matricNumber?: string;
  additionalAttendees?: AdditionalAttendee[];
  allowFriendsToSee?: boolean;
  subtotal: number;
  fee: number;
  total: number;
  ticketCode: string;
}

export interface UserProfile {
  id: string;
  username: string; // e.g. "tade_oou"
  fullName: string;
  email: string;
  role: "partygoer" | "organizer";
  campus: string;
  bio?: string;
  friends: string[]; // usernames
  eventsAttending: {
    eventId: string;
    allowFriendsToSee: boolean;
    ticketCode?: string;
    purchasedAt: string;
  }[];
}

export interface CircleEventSuggestion {
  id: string;
  eventId: string;
  suggestedBy: string; // username
  suggestedAt: string;
  votes: string[]; // usernames of members who voted
}

export interface CircleActivityItem {
  id: string;
  type:
    | "circle_created"
    | "member_joined"
    | "member_left"
    | "event_suggested"
    | "vote_cast"
    | "event_selected"
    | "voting_reopened";
  actorUsername: string;
  description: string;
  timestamp: string;
  eventId?: string;
}

export interface PartyCircle {
  id: string;
  name: string;
  description?: string;
  createdBy: string; // owner username
  members: string[]; // usernames
  inviteCode: string;
  targetEventId?: string; // officially selected event ID
  isVotingOpen: boolean;
  suggestions: CircleEventSuggestion[];
  activity: CircleActivityItem[];
  createdAt: string;
}

export interface CreatorTicketTier {
  id: string;
  name: string;
  price: number;
  capacity: number;
  description?: string;
}

export interface HostEventFormData {
  title: string;
  category: EventCategory;
  campus: string;
  venue: string;
  date: string;
  time: string;
  expectedAttendance: string;
  ticketPriceType: "paid" | "free" | "tiered";
  startingPrice: string;
  organizerName: string;
  organizerRole: string;
  organizerEmail: string;
  organizerPhone: string;
  description: string;
}

export interface EventPhoto {
  id: string;
  eventId: string;
  url: string;
  category: "all" | "red-carpet" | "crowd" | "stage" | "vip";
  categoryLabel: string;
  caption?: string;
  photographer?: string;
  uploadedBy: string; // organizer username
  uploadedAt: string;
  downloadsCount: number;
}

