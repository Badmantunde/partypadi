"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  PartyCircle,
  CircleEventSuggestion,
  CircleActivityItem,
  EventGift,
  GifterLevel,
  AttendeeMetricItem,
} from "@/types";
import {
  supabase,
  isSupabaseConfigured,
  signOutUser,
  signInWithEmail,
  signUpWithEmail,
  signInWithOtp,
} from "@/lib/supabase";

// Seed community users across campus life with Gifter Badges
const SEED_USERS: UserProfile[] = [
  {
    id: "user-1",
    username: "tade_vibes",
    fullName: "Tade Adeyemi",
    email: "tade@gmail.com",
    role: "partygoer",
    campus: "Main Campus",
    bio: "Main Hall vibes & sunset sessions lover",
    gifterLevel: 1, // Level 1 Gifter 🥉
    totalGifted: 3500,
    friends: ["fola_vibes", "chioma_k"],
    eventsAttending: [
      { eventId: "after-class-sunset", allowFriendsToSee: true, ticketCode: "PP-829141", purchasedAt: "2026-10-09" },
      { eventId: "green-room-sessions", allowFriendsToSee: true, ticketCode: "PP-194012", purchasedAt: "2026-10-10" },
    ],
  },
  {
    id: "user-2",
    username: "fola_vibes",
    fullName: "Fola Coker",
    email: "fola@gmail.com",
    role: "partygoer",
    campus: "Main Campus",
    bio: "Moot court by day, campus concerts by night",
    gifterLevel: 2, // Level 2 Gifter 🥈
    totalGifted: 15000,
    friends: ["tade_vibes", "chioma_k", "kemilaw"],
    eventsAttending: [
      { eventId: "after-class-sunset", allowFriendsToSee: true, ticketCode: "PP-449102", purchasedAt: "2026-10-08" },
      { eventId: "fassa-dinner-awards", allowFriendsToSee: true, ticketCode: "PP-772910", purchasedAt: "2026-10-09" },
    ],
  },
  {
    id: "user-3",
    username: "chioma_k",
    fullName: "Chioma Kalu",
    email: "chioma@gmail.com",
    role: "partygoer",
    campus: "Main Campus",
    bio: "Campus paparazzi & cultural night hypeman",
    gifterLevel: 1, // Level 1 Gifter 🥉
    totalGifted: 2000,
    friends: ["tade_vibes", "fola_vibes"],
    eventsAttending: [
      { eventId: "after-class-sunset", allowFriendsToSee: true, ticketCode: "PP-301982", purchasedAt: "2026-10-10" },
      { eventId: "afrofest-culture-night", allowFriendsToSee: true, ticketCode: "PP-592817", purchasedAt: "2026-10-10" },
    ],
  },
  {
    id: "user-4",
    username: "bayo_tech",
    fullName: "Adebayo Johnson",
    email: "bayo@gmail.com",
    role: "partygoer",
    campus: "Main Campus",
    bio: "Computer Science '25 · Building hackathons & campus sound clashes",
    gifterLevel: 3, // Level 3 Gifter 🥇
    totalGifted: 25000,
    friends: ["tade_vibes"],
    eventsAttending: [
      { eventId: "builders-hangout", allowFriendsToSee: true, ticketCode: "PP-990184", purchasedAt: "2026-10-10" },
    ],
  },
  {
    id: "user-5",
    username: "fassa_execs",
    fullName: "FASSA Social Committee",
    email: "social@fassa-events.org",
    role: "organizer",
    campus: "Main Campus",
    bio: "Official Social Directorate, Faculty Social Committee",
    friends: [],
    eventsAttending: [],
  },
];

// Seed Gifts & Support Contributions
const SEED_GIFTS: EventGift[] = [
  {
    id: "gift-1",
    eventId: "after-class-sunset",
    userId: "user-2",
    gifterName: "Fola Coker",
    gifterUsername: "fola_vibes",
    amount: 15000,
    level: 2,
    message: "Drinks support for the sound engineering crew! Keep the energy high 🔊🔥",
    isPublic: true,
    createdAt: "2026-10-10T16:20:00Z",
  },
  {
    id: "gift-2",
    eventId: "after-class-sunset",
    userId: "user-1",
    gifterName: "Tade Adeyemi",
    gifterUsername: "tade_vibes",
    amount: 3500,
    level: 1,
    message: "Shoutout to DJ Tee! Sunset sessions always hits different 🌅",
    isPublic: true,
    createdAt: "2026-10-10T18:45:00Z",
  },
  {
    id: "gift-3",
    eventId: "after-class-sunset",
    userId: "user-4",
    gifterName: "Adebayo Johnson",
    gifterUsername: "bayo_tech",
    amount: 25000,
    level: 3,
    message: "Supporting campus tech & nightlife culture! Table 4 on me 🍾",
    isPublic: true,
    createdAt: "2026-10-11T01:10:00Z",
  },
  {
    id: "gift-4",
    eventId: "green-room-sessions",
    userId: "user-3",
    gifterName: "Chioma Kalu",
    gifterUsername: "chioma_k",
    amount: 2000,
    level: 1,
    message: "For the photobooth team and light operators! 📸✨",
    isPublic: true,
    createdAt: "2026-10-10T20:15:00Z",
  },
];

// Seed Attendee Metrics for Organizer Dashboard
const SEED_ATTENDEES: AttendeeMetricItem[] = [
  {
    id: "att-1",
    eventId: "after-class-sunset",
    name: "Tade Adeyemi",
    username: "tade_vibes",
    email: "tade@gmail.com",
    phone: "0801 234 5678",
    ticketTier: "Regular Pass",
    amountPaid: 2500,
    ticketCode: "PP-829141",
    status: "checked_in",
    registeredAt: "2026-10-09 14:22",
    checkedInAt: "2026-10-10 17:15",
    gifterLevel: 1,
    companionsCount: 0,
  },
  {
    id: "att-2",
    eventId: "after-class-sunset",
    name: "Fola Coker",
    username: "fola_vibes",
    email: "fola@gmail.com",
    phone: "0802 345 6789",
    ticketTier: "Squad Table (Pass for 5)",
    amountPaid: 15000,
    ticketCode: "PP-449102",
    status: "checked_in",
    registeredAt: "2026-10-08 19:40",
    checkedInAt: "2026-10-10 17:30",
    gifterLevel: 2,
    companionsCount: 4,
  },
  {
    id: "att-3",
    eventId: "after-class-sunset",
    name: "Chioma Kalu",
    username: "chioma_k",
    email: "chioma@gmail.com",
    phone: "0803 456 7890",
    ticketTier: "Early Bird",
    amountPaid: 1500,
    ticketCode: "PP-301982",
    status: "paid",
    registeredAt: "2026-10-10 11:05",
    gifterLevel: 1,
    companionsCount: 0,
  },
  {
    id: "att-4",
    eventId: "after-class-sunset",
    name: "Adebayo Johnson",
    username: "bayo_tech",
    email: "bayo@gmail.com",
    phone: "0804 567 8901",
    ticketTier: "Squad Table (Pass for 5)",
    amountPaid: 15000,
    ticketCode: "PP-990184",
    status: "paid",
    registeredAt: "2026-10-10 13:50",
    gifterLevel: 3,
    companionsCount: 4,
  },
  {
    id: "att-5",
    eventId: "after-class-sunset",
    name: "Kemi Adeleke",
    username: "kemilaw",
    email: "kemi.law@gmail.com",
    phone: "0805 678 9012",
    ticketTier: "Regular Pass",
    amountPaid: 2500,
    ticketCode: "PP-671294",
    status: "paid",
    registeredAt: "2026-10-10 15:10",
    companionsCount: 0,
  },
  {
    id: "att-6",
    eventId: "after-class-sunset",
    name: "Olamide Balogun",
    username: "baddo_vibes",
    email: "olamide.b@gmail.com",
    phone: "0806 789 0123",
    ticketTier: "Early Bird",
    amountPaid: 0,
    ticketCode: "WL-28401",
    status: "waitlist",
    registeredAt: "2026-10-10 18:22",
    companionsCount: 0,
  },
  {
    id: "att-7",
    eventId: "after-class-sunset",
    name: "Zainab Aliyu",
    username: "zainab_a",
    email: "zainab.aliyu@gmail.com",
    phone: "0807 890 1234",
    ticketTier: "Squad Table (Pass for 5)",
    amountPaid: 0,
    ticketCode: "WL-39102",
    status: "waitlist",
    registeredAt: "2026-10-10 19:04",
    companionsCount: 4,
  },
  {
    id: "att-8",
    eventId: "after-class-sunset",
    name: "Emeka Okafor",
    username: "emeka_sound",
    email: "emeka.ok@gmail.com",
    phone: "0808 901 2345",
    ticketTier: "Regular Pass",
    amountPaid: 0,
    ticketCode: "WL-44021",
    status: "waitlist",
    registeredAt: "2026-10-10 21:15",
    companionsCount: 0,
  },
  {
    id: "att-9",
    eventId: "after-class-sunset",
    name: "Funke Daniels",
    username: "funke_d",
    email: "funke.d@gmail.com",
    phone: "0809 012 3456",
    ticketTier: "Regular Pass",
    amountPaid: 2500,
    ticketCode: "PP-552109",
    status: "checked_in",
    registeredAt: "2026-10-09 22:30",
    checkedInAt: "2026-10-10 17:45",
    companionsCount: 0,
  },
  {
    id: "att-10",
    eventId: "after-class-sunset",
    name: "David Adeleke Jr",
    username: "davido_fan",
    email: "david.fan@gmail.com",
    phone: "0810 123 4567",
    ticketTier: "Regular Pass",
    amountPaid: 2500,
    ticketCode: "PP-663810",
    status: "paid",
    registeredAt: "2026-10-10 09:12",
    companionsCount: 0,
  },
];

const SEED_CIRCLES: PartyCircle[] = [
  {
    id: "circle-1",
    name: "Friday Sunset Clique",
    description: "Gathering at the campus lawn before heading to Mini Stadium for Sunset Sessions.",
    createdBy: "tade_vibes",
    members: ["tade_vibes", "fola_vibes", "chioma_k"],
    inviteCode: "SUNSET26",
    targetEventId: "after-class-sunset",
    isVotingOpen: false,
    suggestions: [
      {
        id: "sugg-1",
        eventId: "after-class-sunset",
        suggestedBy: "tade_vibes",
        suggestedAt: "2026-10-09",
        votes: ["tade_vibes", "fola_vibes", "chioma_k"],
      },
      {
        id: "sugg-2",
        eventId: "green-room-sessions",
        suggestedBy: "fola_vibes",
        suggestedAt: "2026-10-09",
        votes: [],
      },
    ],
    activity: [
      {
        id: "act-1",
        type: "circle_created",
        actorUsername: "tade_vibes",
        description: "@tade_vibes created the circle",
        timestamp: "2026-10-09T14:30:00Z",
      },
      {
        id: "act-2",
        type: "member_joined",
        actorUsername: "fola_vibes",
        description: "@fola_vibes joined the circle",
        timestamp: "2026-10-09T14:45:00Z",
      },
      {
        id: "act-3",
        type: "member_joined",
        actorUsername: "chioma_k",
        description: "@chioma_k joined the circle",
        timestamp: "2026-10-09T15:00:00Z",
      },
      {
        id: "act-4",
        type: "event_suggested",
        actorUsername: "tade_vibes",
        description: "@tade_vibes suggested AFTER CLASS: Sunset Sessions",
        timestamp: "2026-10-09T15:15:00Z",
        eventId: "after-class-sunset",
      },
      {
        id: "act-5",
        type: "vote_cast",
        actorUsername: "chioma_k",
        description: "@chioma_k voted for AFTER CLASS: Sunset Sessions",
        timestamp: "2026-10-09T15:30:00Z",
        eventId: "after-class-sunset",
      },
      {
        id: "act-6",
        type: "event_selected",
        actorUsername: "tade_vibes",
        description: "@tade_vibes confirmed AFTER CLASS: Sunset Sessions as the circle's plan",
        timestamp: "2026-10-09T16:00:00Z",
        eventId: "after-class-sunset",
      },
    ],
    createdAt: "2026-10-09",
  },
  {
    id: "circle-2",
    name: "Law & Friends Gala Squad",
    description: "Black-tie dinner table reservation and pre-drinks linkup.",
    createdBy: "fola_vibes",
    members: ["fola_vibes", "tade_vibes"],
    inviteCode: "LAWGALA",
    targetEventId: undefined,
    isVotingOpen: true,
    suggestions: [
      {
        id: "sugg-3",
        eventId: "fassa-dinner-awards",
        suggestedBy: "fola_vibes",
        suggestedAt: "2026-10-10",
        votes: ["fola_vibes"],
      },
      {
        id: "sugg-4",
        eventId: "afrofest-culture-night",
        suggestedBy: "tade_vibes",
        suggestedAt: "2026-10-10",
        votes: ["tade_vibes"],
      },
    ],
    activity: [
      {
        id: "act-7",
        type: "circle_created",
        actorUsername: "fola_vibes",
        description: "@fola_vibes created the circle",
        timestamp: "2026-10-10T11:00:00Z",
      },
      {
        id: "act-8",
        type: "member_joined",
        actorUsername: "tade_vibes",
        description: "@tade_vibes joined the circle",
        timestamp: "2026-10-10T11:30:00Z",
      },
      {
        id: "act-9",
        type: "event_suggested",
        actorUsername: "fola_vibes",
        description: "@fola_vibes suggested FASSA Gala '26",
        timestamp: "2026-10-10T12:00:00Z",
        eventId: "fassa-dinner-awards",
      },
      {
        id: "act-10",
        type: "event_suggested",
        actorUsername: "tade_vibes",
        description: "@tade_vibes suggested AfroFest Night",
        timestamp: "2026-10-10T12:15:00Z",
        eventId: "afrofest-culture-night",
      },
    ],
    createdAt: "2026-10-10",
  },
];

export const getGifterLevel = (totalGifted: number): GifterLevel => {
  if (totalGifted >= 150000) return 6;
  if (totalGifted >= 75000) return 5;
  if (totalGifted >= 35000) return 4;
  if (totalGifted >= 15000) return 3;
  if (totalGifted >= 5000) return 2;
  return 1;
};

export const GIFTER_LEVEL_INFO: Record<
  GifterLevel,
  { name: string; icon: string; minAmount: number; color: string; badge: string; imageUrl: string; description: string }
> = {
  1: {
    name: "Padi",
    icon: "🥉",
    minAmount: 1000,
    color: "#CD7F32",
    badge: "Level 1 Gifter 🥉",
    imageUrl: "/images/gifterbadge/Padi-level-1.png",
    description: "Contributed ₦1k+ to campus event culture",
  },
  2: {
    name: "Plug",
    icon: "🥈",
    minAmount: 5000,
    color: "#E2E8F0",
    badge: "Level 2 Gifter 🥈",
    imageUrl: "/images/gifterbadge/Plug-level-2.png",
    description: "Contributed ₦5k+ boosting DJs, light & drinks",
  },
  3: {
    name: "Hype Padi",
    icon: "🥇",
    minAmount: 15000,
    color: "#FACC15",
    badge: "Level 3 Gifter 🥇",
    imageUrl: "/images/gifterbadge/Hype-padi.png",
    description: "Contributed ₦15k+ powering squad energy & stage hype",
  },
  4: {
    name: "Big Padi",
    icon: "💎",
    minAmount: 35000,
    color: "#38BDF8",
    badge: "Level 4 Gifter 💎",
    imageUrl: "/images/gifterbadge/Big-Padi-level-4.png",
    description: "Contributed ₦35k+ VIP patron of campus nightlife",
  },
  5: {
    name: "Headliner",
    icon: "👑",
    minAmount: 75000,
    color: "#A855F7",
    badge: "Level 5 Headliner 👑",
    imageUrl: "/images/gifterbadge/Headliner-level-5.png",
    description: "Contributed ₦75k+ campus headliner & benefactor",
  },
  6: {
    name: "Legend",
    icon: "🏆",
    minAmount: 150000,
    color: "#C5FF35",
    badge: "Level 6 Legend 🏆",
    imageUrl: "/images/gifterbadge/legend-level-6.png",
    description: "Contributed ₦150k+ immortal campus benefactor & icon",
  },
};

interface AuthContextType {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  circles: PartyCircle[];
  gifts: EventGift[];
  attendees: AttendeeMetricItem[];
  isSupabaseConfigured: boolean;
  authModalOpen: boolean;
  circleModalOpen: boolean;
  profileModalOpen: boolean;
  activeTargetEventId?: string;
  login: (emailOrUsername: string) => boolean;
  signup: (data: {
    fullName: string;
    username: string;
    email: string;
    role: "partygoer" | "organizer";
    campus: string;
    bio?: string;
  }) => boolean;
  logout: () => void;
  // Supabase Auth methods
  signInWithSupabase: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  signUpWithSupabase: (
    email: string,
    password: string,
    userData: { fullName: string; username: string; role: "partygoer" | "organizer"; campus: string }
  ) => Promise<{ success: boolean; message: string }>;
  signInWithMagicLink: (email: string) => Promise<{ success: boolean; message: string }>;
  // Gifting & Metrics
  sendGiftToEvent: (data: {
    eventId: string;
    amount: number;
    message?: string;
    isPublic?: boolean;
    customName?: string;
  }) => { success: boolean; gift: EventGift; newGifterLevel: GifterLevel };
  getEventGifts: (eventId: string) => EventGift[];
  getEventAttendees: (eventId: string) => AttendeeMetricItem[];
  promoteWaitlistAttendee: (attendeeId: string) => boolean;
  checkInAttendee: (attendeeId: string) => boolean;
  addAttendeeMetric: (item: Omit<AttendeeMetricItem, "id" | "registeredAt">) => void;
  // Social circles & Friends
  addFriend: (friendUsername: string) => boolean;
  removeFriend: (friendUsername: string) => void;
  getCircle: (circleId: string) => PartyCircle | undefined;
  getCircleByInviteCode: (inviteCode: string) => PartyCircle | undefined;
  createCircle: (data: {
    name: string;
    description?: string;
    members?: string[];
    targetEventId?: string;
  }) => PartyCircle;
  updateCircle: (circleId: string, updates: Partial<PartyCircle>) => void;
  joinCircle: (circleIdOrInviteCode: string) => { success: boolean; message: string; circle?: PartyCircle };
  leaveCircle: (circleId: string) => boolean;
  removeCircleMember: (circleId: string, memberUsername: string) => boolean;
  suggestEventToCircle: (circleId: string, eventId: string) => boolean;
  voteForEvent: (circleId: string, suggestionId: string) => boolean;
  selectFinalEvent: (circleId: string, eventId: string) => boolean;
  reopenVoting: (circleId: string) => boolean;
  getMemberTicketStatus: (eventId: string, memberUsername: string) => boolean;
  rsvpEvent: (eventId: string, allowFriendsToSee: boolean, ticketCode: string) => void;
  getFriendsAttendingEvent: (eventId: string) => Array<{ username: string; fullName: string; bio?: string }>;
  openAuthModal: (defaultTab?: "signin" | "signup", defaultRole?: "partygoer" | "organizer") => void;
  closeAuthModal: () => void;
  openCircleModal: (targetEventId?: string) => void;
  closeCircleModal: () => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(SEED_USERS);
  const [circles, setCircles] = useState<PartyCircle[]>(SEED_CIRCLES);
  const [gifts, setGifts] = useState<EventGift[]>(SEED_GIFTS);
  const [attendees, setAttendees] = useState<AttendeeMetricItem[]>(SEED_ATTENDEES);

  // Modal controls
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [circleModalOpen, setCircleModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeTargetEventId, setActiveTargetEventId] = useState<string | undefined>(undefined);

  // Hydrate from localStorage on client mount & subscribe to Supabase
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("pp_current_user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      const storedUsers = localStorage.getItem("pp_all_users");
      if (storedUsers) {
        setAllUsers(JSON.parse(storedUsers));
      }
      const storedCircles = localStorage.getItem("pp_circles");
      if (storedCircles) {
        setCircles(JSON.parse(storedCircles));
      }
      const storedGifts = localStorage.getItem("pp_gifts");
      if (storedGifts) {
        setGifts(JSON.parse(storedGifts));
      }
      const storedAttendees = localStorage.getItem("pp_attendees");
      if (storedAttendees) {
        setAttendees(JSON.parse(storedAttendees));
      }
    } catch (e) {
      console.warn("Storage hydration error", e);
    }

    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const sbUser = session.user;
          const meta = sbUser.user_metadata || {};
          const username = meta.username || sbUser.email?.split("@")[0] || "campus_padi";
          const fullName = meta.full_name || meta.fullName || "Party Padi User";
          const role = (meta.role as "partygoer" | "organizer") || "partygoer";
          const campus = meta.campus || "Main Campus";

          const profile: UserProfile = {
            id: sbUser.id,
            username,
            fullName,
            email: sbUser.email || "",
            role,
            campus,
            bio: meta.bio || "Active PartyPadi member",
            friends: ["tade_vibes", "fola_vibes"],
            eventsAttending: [],
          };
          saveUser(profile);
        }
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, []);

  const saveUser = (user: UserProfile | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem("pp_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("pp_current_user");
    }
  };


  const login = (emailOrUsername: string): boolean => {
    const clean = emailOrUsername.trim().toLowerCase().replace(/^@/, "");
    const normalized = clean === "tade_oou" ? "tade_vibes" : clean;
    const found = allUsers.find(
      (u) =>
        u.username.toLowerCase() === normalized ||
        u.email.toLowerCase() === normalized ||
        u.username.toLowerCase() === clean ||
        u.email.toLowerCase() === clean
    );

    if (found) {
      saveUser(found);
      return true;
    }

    // If not found in seed, create a quick partygoer profile for instant access
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      username: clean.includes("@") ? clean.split("@")[0] : clean,
      fullName: clean.charAt(0).toUpperCase() + clean.slice(1),
      email: clean.includes("@") ? clean : `${clean}@gmail.com`,
      role: "partygoer",
      campus: "Main Campus",
      bio: "Active PartyPadi partygoer & vibe creator",
      friends: ["tade_vibes", "fola_vibes"],
      eventsAttending: [],
    };

    const updatedList = [...allUsers, newUser];
    setAllUsers(updatedList);
    localStorage.setItem("pp_all_users", JSON.stringify(updatedList));
    saveUser(newUser);
    return true;
  };

  const signup = (data: {
    fullName: string;
    username: string;
    email: string;
    role: "partygoer" | "organizer";
    campus: string;
    bio?: string;
  }): boolean => {
    const cleanUsername = data.username.trim().toLowerCase().replace(/^@/, "");
    const existing = allUsers.find(
      (u) =>
        u.username.toLowerCase() === cleanUsername ||
        u.email.toLowerCase() === data.email.trim().toLowerCase()
    );

    if (existing) {
      saveUser(existing);
      return true;
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      role: data.role,
      campus: data.campus || "Main Campus",
      bio: data.bio || (data.role === "partygoer" ? "Partygoer & campus vibe seeker" : "Verified campus event host"),
      friends: data.role === "partygoer" ? ["tade_vibes", "fola_vibes"] : [], // Auto-connect with campus ambassadors
      eventsAttending: [],
    };

    const updatedList = [...allUsers, newUser];
    setAllUsers(updatedList);
    localStorage.setItem("pp_all_users", JSON.stringify(updatedList));
    saveUser(newUser);
    return true;
  };

  const logout = () => {
    signOutUser();
    saveUser(null);
  };

  const signInWithSupabase = async (email: string, password?: string) => {
    return await signInWithEmail(email, password);
  };

  const signUpWithSupabase = async (
    email: string,
    password: string,
    userData: {
      fullName: string;
      username: string;
      role: "partygoer" | "organizer";
      campus: string;
    }
  ) => {
    return await signUpWithEmail(email, password, userData);
  };

  const signInWithMagicLink = async (email: string) => {
    return await signInWithOtp(email);
  };

  const sendGiftToEvent = (data: {
    eventId: string;
    amount: number;
    message?: string;
    isPublic?: boolean;
    customName?: string;
  }) => {
    const gifterName = currentUser ? currentUser.fullName : data.customName || "Campus Supporter";
    const gifterUsername = currentUser ? currentUser.username : undefined;

    const currentTotal = currentUser?.totalGifted || 0;
    const newTotal = currentTotal + data.amount;
    const newGifterLevel = getGifterLevel(newTotal);

    const newGift: EventGift = {
      id: `gift-${Date.now()}`,
      eventId: data.eventId,
      userId: currentUser?.id,
      gifterName,
      gifterUsername,
      amount: data.amount,
      level: newGifterLevel,
      message: data.message || "Big support to the organizing crew & sound engineers! 🔥",
      isPublic: data.isPublic !== false,
      createdAt: new Date().toISOString(),
    };

    const updatedGifts = [newGift, ...gifts];
    setGifts(updatedGifts);
    localStorage.setItem("pp_gifts", JSON.stringify(updatedGifts));

    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        totalGifted: newTotal,
        gifterLevel: newGifterLevel,
      };
      saveUser(updatedUser);

      const updatedUsers = allUsers.map((u) => (u.id === currentUser.id ? updatedUser : u));
      setAllUsers(updatedUsers);
      localStorage.setItem("pp_all_users", JSON.stringify(updatedUsers));

      const updatedAttendees = attendees.map((att) => {
        if (att.username === currentUser.username) {
          return { ...att, gifterLevel: newGifterLevel };
        }
        return att;
      });
      setAttendees(updatedAttendees);
      localStorage.setItem("pp_attendees", JSON.stringify(updatedAttendees));
    }

    return {
      success: true,
      gift: newGift,
      newGifterLevel,
    };
  };

  const getEventGifts = (eventId: string): EventGift[] => {
    return gifts.filter((g) => g.eventId === eventId);
  };

  const getEventAttendees = (eventId: string): AttendeeMetricItem[] => {
    return attendees.filter((a) => a.eventId === eventId);
  };

  const promoteWaitlistAttendee = (attendeeId: string): boolean => {
    let found = false;
    const updated = attendees.map((att) => {
      if (att.id === attendeeId) {
        found = true;
        return {
          ...att,
          status: "paid" as const,
          ticketCode: `PP-PRM-${Math.floor(100000 + Math.random() * 900000)}`,
          amountPaid: att.amountPaid > 0 ? att.amountPaid : 2500,
        };
      }
      return att;
    });
    if (found) {
      setAttendees(updated);
      localStorage.setItem("pp_attendees", JSON.stringify(updated));
    }
    return found;
  };

  const checkInAttendee = (attendeeId: string): boolean => {
    let found = false;
    const updated = attendees.map((att) => {
      if (att.id === attendeeId) {
        found = true;
        return {
          ...att,
          status: "checked_in" as const,
          checkedInAt: new Date().toISOString().replace("T", " ").substring(0, 16),
        };
      }
      return att;
    });
    if (found) {
      setAttendees(updated);
      localStorage.setItem("pp_attendees", JSON.stringify(updated));
    }
    return found;
  };

  const addAttendeeMetric = (item: Omit<AttendeeMetricItem, "id" | "registeredAt">) => {
    const newAttendee: AttendeeMetricItem = {
      ...item,
      id: `att-${Date.now()}`,
      registeredAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    const updated = [newAttendee, ...attendees];
    setAttendees(updated);
    localStorage.setItem("pp_attendees", JSON.stringify(updated));
  };

  const addFriend = (friendUsername: string): boolean => {
    if (!currentUser) return false;
    const clean = friendUsername.trim().toLowerCase().replace(/^@/, "");
    if (clean === currentUser.username.toLowerCase()) return false;
    if (currentUser.friends.includes(clean)) return true;

    const updatedUser: UserProfile = {
      ...currentUser,
      friends: [...currentUser.friends, clean],
    };

    saveUser(updatedUser);

    const updatedList = allUsers.map((u) =>
      u.id === currentUser.id ? updatedUser : u
    );
    setAllUsers(updatedList);
    localStorage.setItem("pp_all_users", JSON.stringify(updatedList));
    return true;
  };

  const removeFriend = (friendUsername: string) => {
    if (!currentUser) return;
    const clean = friendUsername.trim().toLowerCase().replace(/^@/, "");
    const updatedUser: UserProfile = {
      ...currentUser,
      friends: currentUser.friends.filter((f) => f.toLowerCase() !== clean),
    };
    saveUser(updatedUser);
  };

  const getCircle = (circleId: string): PartyCircle | undefined => {
    return circles.find((c) => c.id === circleId);
  };

  const getCircleByInviteCode = (inviteCode: string): PartyCircle | undefined => {
    return circles.find(
      (c) => c.inviteCode.toLowerCase() === inviteCode.trim().toLowerCase()
    );
  };

  const createCircle = (data: {
    name: string;
    description?: string;
    members?: string[];
    targetEventId?: string;
  }): PartyCircle => {
    const rawCode = (
      data.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4) +
      Math.floor(1000 + Math.random() * 9000)
    ).toUpperCase();
    const creator = currentUser ? currentUser.username : "guest";
    const initialMembers = currentUser
      ? Array.from(new Set([currentUser.username, ...(data.members || [])]))
      : (data.members || ["guest"]);

    const newCircle: PartyCircle = {
      id: `circle-${Date.now()}`,
      name: data.name.trim(),
      description: data.description?.trim(),
      createdBy: creator,
      members: initialMembers,
      inviteCode: rawCode,
      targetEventId: data.targetEventId,
      isVotingOpen: true,
      suggestions: data.targetEventId
        ? [
            {
              id: `sugg-${Date.now()}`,
              eventId: data.targetEventId,
              suggestedBy: creator,
              suggestedAt: new Date().toISOString().split("T")[0],
              votes: [creator],
            },
          ]
        : [],
      activity: [
        {
          id: `act-${Date.now()}`,
          type: "circle_created",
          actorUsername: creator,
          description: `@${creator} created circle "${data.name.trim()}"`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updatedCircles = [newCircle, ...circles];
    setCircles(updatedCircles);
    localStorage.setItem("pp_circles", JSON.stringify(updatedCircles));
    return newCircle;
  };

  const updateCircle = (circleId: string, updates: Partial<PartyCircle>) => {
    const updatedCircles = circles.map((c) => {
      if (c.id === circleId) {
        return { ...c, ...updates };
      }
      return c;
    });
    setCircles(updatedCircles);
    localStorage.setItem("pp_circles", JSON.stringify(updatedCircles));
  };

  const joinCircle = (
    circleIdOrInviteCode: string
  ): { success: boolean; message: string; circle?: PartyCircle } => {
    if (!currentUser) {
      return { success: false, message: "Please sign in or create an account to join this circle." };
    }

    const cleanInput = circleIdOrInviteCode.trim().toLowerCase();
    const target = circles.find(
      (c) => c.id.toLowerCase() === cleanInput || c.inviteCode.toLowerCase() === cleanInput
    );

    if (!target) {
      return { success: false, message: "Circle not found or invite code is invalid." };
    }

    if (target.members.includes(currentUser.username)) {
      return { success: true, message: "You are already a member of this circle.", circle: target };
    }

    const updatedCircle: PartyCircle = {
      ...target,
      members: [...target.members, currentUser.username],
      activity: [
        {
          id: `act-${Date.now()}`,
          type: "member_joined",
          actorUsername: currentUser.username,
          description: `@${currentUser.username} joined the circle`,
          timestamp: new Date().toISOString(),
        },
        ...target.activity,
      ],
    };

    const updatedCircles = circles.map((c) => (c.id === target.id ? updatedCircle : c));
    setCircles(updatedCircles);
    localStorage.setItem("pp_circles", JSON.stringify(updatedCircles));
    return { success: true, message: `Welcome! You have joined "${target.name}".`, circle: updatedCircle };
  };

  const leaveCircle = (circleId: string): boolean => {
    if (!currentUser) return false;
    const target = circles.find((c) => c.id === circleId);
    if (!target) return false;

    // If owner, check if other members exist
    if (target.createdBy === currentUser.username && target.members.length > 1) {
      const nextOwner = target.members.find((m) => m !== currentUser.username) || "guest";
      const updatedCircle: PartyCircle = {
        ...target,
        createdBy: nextOwner,
        members: target.members.filter((m) => m !== currentUser.username),
        activity: [
          {
            id: `act-${Date.now()}`,
            type: "member_left",
            actorUsername: currentUser.username,
            description: `@${currentUser.username} left the circle. Ownership passed to @${nextOwner}.`,
            timestamp: new Date().toISOString(),
          },
          ...target.activity,
        ],
      };
      const updatedCircles = circles.map((c) => (c.id === target.id ? updatedCircle : c));
      setCircles(updatedCircles);
      localStorage.setItem("pp_circles", JSON.stringify(updatedCircles));
      return true;
    }

    const updatedCircle: PartyCircle = {
      ...target,
      members: target.members.filter((m) => m !== currentUser.username),
      activity: [
        {
          id: `act-${Date.now()}`,
          type: "member_left",
          actorUsername: currentUser.username,
          description: `@${currentUser.username} left the circle`,
          timestamp: new Date().toISOString(),
        },
        ...target.activity,
      ],
    };
    const updatedCircles = circles.map((c) => (c.id === target.id ? updatedCircle : c));
    setCircles(updatedCircles);
    localStorage.setItem("pp_circles", JSON.stringify(updatedCircles));
    return true;
  };

  const removeCircleMember = (circleId: string, memberUsername: string): boolean => {
    if (!currentUser) return false;
    const target = circles.find((c) => c.id === circleId);
    if (!target || target.createdBy !== currentUser.username) return false;

    const updatedCircle: PartyCircle = {
      ...target,
      members: target.members.filter((m) => m.toLowerCase() !== memberUsername.toLowerCase()),
      suggestions: target.suggestions.map((s) => ({
        ...s,
        votes: s.votes.filter((v) => v.toLowerCase() !== memberUsername.toLowerCase()),
      })),
      activity: [
        {
          id: `act-${Date.now()}`,
          type: "member_left",
          actorUsername: currentUser.username,
          description: `@${currentUser.username} removed @${memberUsername} from the circle`,
          timestamp: new Date().toISOString(),
        },
        ...target.activity,
      ],
    };

    const updatedCircles = circles.map((c) => (c.id === target.id ? updatedCircle : c));
    setCircles(updatedCircles);
    localStorage.setItem("pp_circles", JSON.stringify(updatedCircles));
    return true;
  };

  const suggestEventToCircle = (circleId: string, eventId: string): boolean => {
    if (!currentUser) return false;
    const target = circles.find((c) => c.id === circleId);
    if (!target) return false;

    // Check if already suggested
    if (target.suggestions.some((s) => s.eventId === eventId)) {
      return false;
    }

    // Auto-cast 1 vote for this suggestion, removing previous vote if any
    const updatedSuggestions = target.suggestions.map((s) => ({
      ...s,
      votes: s.votes.filter((v) => v !== currentUser.username),
    }));

    const newSuggestion: CircleEventSuggestion = {
      id: `sugg-${Date.now()}`,
      eventId,
      suggestedBy: currentUser.username,
      suggestedAt: new Date().toISOString().split("T")[0],
      votes: [currentUser.username],
    };

    const updatedCircle: PartyCircle = {
      ...target,
      suggestions: [...updatedSuggestions, newSuggestion],
      activity: [
        {
          id: `act-${Date.now()}`,
          type: "event_suggested",
          actorUsername: currentUser.username,
          description: `@${currentUser.username} suggested an event`,
          eventId,
          timestamp: new Date().toISOString(),
        },
        ...target.activity,
      ],
    };

    const updatedCircles = circles.map((c) => (c.id === target.id ? updatedCircle : c));
    setCircles(updatedCircles);
    localStorage.setItem("pp_circles", JSON.stringify(updatedCircles));
    return true;
  };

  const voteForEvent = (circleId: string, suggestionId: string): boolean => {
    if (!currentUser) return false;
    const target = circles.find((c) => c.id === circleId);
    if (!target) return false;

    const targetSugg = target.suggestions.find((s) => s.id === suggestionId);
    if (!targetSugg) return false;

    const alreadyVotedThis = targetSugg.votes.includes(currentUser.username);

    const updatedSuggestions = target.suggestions.map((s) => {
      const cleanVotes = s.votes.filter((v) => v !== currentUser.username);
      if (s.id === suggestionId && !alreadyVotedThis) {
        return { ...s, votes: [...cleanVotes, currentUser.username] };
      }
      return { ...s, votes: cleanVotes };
    });

    const updatedCircle: PartyCircle = {
      ...target,
      suggestions: updatedSuggestions,
      activity: [
        {
          id: `act-${Date.now()}`,
          type: "vote_cast",
          actorUsername: currentUser.username,
          description: alreadyVotedThis
            ? `@${currentUser.username} withdrew their vote`
            : `@${currentUser.username} voted for an event`,
          eventId: targetSugg.eventId,
          timestamp: new Date().toISOString(),
        },
        ...target.activity,
      ],
    };

    const updatedCircles = circles.map((c) => (c.id === target.id ? updatedCircle : c));
    setCircles(updatedCircles);
    localStorage.setItem("pp_circles", JSON.stringify(updatedCircles));
    return true;
  };

  const selectFinalEvent = (circleId: string, eventId: string): boolean => {
    if (!currentUser) return false;
    const target = circles.find((c) => c.id === circleId);
    if (!target || target.createdBy !== currentUser.username) return false;

    const updatedCircle: PartyCircle = {
      ...target,
      targetEventId: eventId,
      isVotingOpen: false,
      activity: [
        {
          id: `act-${Date.now()}`,
          type: "event_selected",
          actorUsername: currentUser.username,
          description: `@${currentUser.username} confirmed the official circle plan!`,
          eventId,
          timestamp: new Date().toISOString(),
        },
        ...target.activity,
      ],
    };

    const updatedCircles = circles.map((c) => (c.id === target.id ? updatedCircle : c));
    setCircles(updatedCircles);
    localStorage.setItem("pp_circles", JSON.stringify(updatedCircles));
    return true;
  };

  const reopenVoting = (circleId: string): boolean => {
    if (!currentUser) return false;
    const target = circles.find((c) => c.id === circleId);
    if (!target || target.createdBy !== currentUser.username) return false;

    const updatedCircle: PartyCircle = {
      ...target,
      isVotingOpen: true,
      activity: [
        {
          id: `act-${Date.now()}`,
          type: "voting_reopened",
          actorUsername: currentUser.username,
          description: `@${currentUser.username} reopened event voting for the group`,
          timestamp: new Date().toISOString(),
        },
        ...target.activity,
      ],
    };

    const updatedCircles = circles.map((c) => (c.id === target.id ? updatedCircle : c));
    setCircles(updatedCircles);
    localStorage.setItem("pp_circles", JSON.stringify(updatedCircles));
    return true;
  };

  const getMemberTicketStatus = (eventId: string, memberUsername: string): boolean => {
    const member = allUsers.find(
      (u) => u.username.toLowerCase() === memberUsername.toLowerCase()
    );
    if (!member) return false;
    return member.eventsAttending.some((att) => att.eventId === eventId);
  };

  const rsvpEvent = (eventId: string, allowFriendsToSee: boolean, ticketCode: string) => {
    if (!currentUser) return;

    const existingIndex = currentUser.eventsAttending.findIndex((e) => e.eventId === eventId);
    let updatedEvents = [...currentUser.eventsAttending];

    if (existingIndex >= 0) {
      updatedEvents[existingIndex] = {
        eventId,
        allowFriendsToSee,
        ticketCode,
        purchasedAt: new Date().toISOString().split("T")[0],
      };
    } else {
      updatedEvents.push({
        eventId,
        allowFriendsToSee,
        ticketCode,
        purchasedAt: new Date().toISOString().split("T")[0],
      });
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      eventsAttending: updatedEvents,
    };

    saveUser(updatedUser);

    const updatedList = allUsers.map((u) =>
      u.id === currentUser.id ? updatedUser : u
    );
    setAllUsers(updatedList);
    localStorage.setItem("pp_all_users", JSON.stringify(updatedList));
  };

  const getFriendsAttendingEvent = (eventId: string) => {
    if (!currentUser) return [];

    // Find all users who are friends of currentUser and attending this event with allowFriendsToSee === true
    const friendSet = new Set(currentUser.friends.map((f) => f.toLowerCase()));

    return allUsers
      .filter((u) => {
        if (!friendSet.has(u.username.toLowerCase())) return false;
        const record = u.eventsAttending.find((att) => att.eventId === eventId);
        return record && record.allowFriendsToSee;
      })
      .map((u) => ({
        username: u.username,
        fullName: u.fullName,
        bio: u.bio,
      }));
  };

  const openAuthModal = (defaultTab: "signin" | "signup" = "signin", defaultRole: "partygoer" | "organizer" = "partygoer") => {
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const openCircleModal = (targetEventId?: string) => {
    setActiveTargetEventId(targetEventId);
    setCircleModalOpen(true);
  };

  const closeCircleModal = () => {
    setCircleModalOpen(false);
    setActiveTargetEventId(undefined);
  };

  const openProfileModal = () => {
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        circles,
        gifts,
        attendees,
        isSupabaseConfigured,
        authModalOpen,
        circleModalOpen,
        profileModalOpen,
        activeTargetEventId,
        login,
        signup,
        logout,
        signInWithSupabase,
        signUpWithSupabase,
        signInWithMagicLink,
        sendGiftToEvent,
        getEventGifts,
        getEventAttendees,
        promoteWaitlistAttendee,
        checkInAttendee,
        addAttendeeMetric,
        addFriend,
        removeFriend,
        getCircle,
        getCircleByInviteCode,
        createCircle,
        updateCircle,
        joinCircle,
        leaveCircle,
        removeCircleMember,
        suggestEventToCircle,
        voteForEvent,
        selectFinalEvent,
        reopenVoting,
        getMemberTicketStatus,
        rsvpEvent,
        getFriendsAttendingEvent,
        openAuthModal,
        closeAuthModal,
        openCircleModal,
        closeCircleModal,
        openProfileModal,
        closeProfileModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
