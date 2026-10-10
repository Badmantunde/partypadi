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
  campus: string; // e.g. "OOU · Main Campus"
  fullLocation: string; // e.g. "Mini Stadium Lawn, Ago-Iwoye"
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

export interface BookingDetails {
  eventId: string;
  tierId: string;
  quantity: number;
  fullName: string;
  email: string;
  phone: string;
  matricNumber?: string;
  subtotal: number;
  fee: number;
  total: number;
  ticketCode: string;
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
