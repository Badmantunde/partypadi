"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, PartyCircle, CircleEventSuggestion, CircleActivityItem } from "@/types";

// Seed community users at OOU Ago-Iwoye
const SEED_USERS: UserProfile[] = [
  {
    id: "user-1",
    username: "tade_oou",
    fullName: "Tade Adeyemi",
    email: "tade@student.oouagoiwoye.edu.ng",
    role: "partygoer",
    campus: "OOU Ago-Iwoye",
    bio: "Biochemistry '26 · Main Hall vibes & sunset sessions lover",
    friends: ["fola_vibes", "chioma_k"],
    eventsAttending: [
      { eventId: "after-class-sunset", allowFriendsToSee: true, ticketCode: "PP-OOU-829141", purchasedAt: "2026-10-09" },
      { eventId: "green-room-sessions", allowFriendsToSee: true, ticketCode: "PP-OOU-194012", purchasedAt: "2026-10-10" },
    ],
  },
  {
    id: "user-2",
    username: "fola_vibes",
    fullName: "Fola Coker",
    email: "fola@student.oouagoiwoye.edu.ng",
    role: "partygoer",
    campus: "OOU Ago-Iwoye",
    bio: "Law '25 · Moot court by day, campus concerts by night",
    friends: ["tade_oou", "chioma_k", "kemilaw"],
    eventsAttending: [
      { eventId: "after-class-sunset", allowFriendsToSee: true, ticketCode: "PP-OOU-449102", purchasedAt: "2026-10-08" },
      { eventId: "fassa-dinner-awards", allowFriendsToSee: true, ticketCode: "PP-OOU-772910", purchasedAt: "2026-10-09" },
    ],
  },
  {
    id: "user-3",
    username: "chioma_k",
    fullName: "Chioma Kalu",
    email: "chioma@student.oouagoiwoye.edu.ng",
    role: "partygoer",
    campus: "OOU Ago-Iwoye",
    bio: "Mass Comm '26 · Campus paparazzi & cultural night hypeman",
    friends: ["tade_oou", "fola_vibes"],
    eventsAttending: [
      { eventId: "after-class-sunset", allowFriendsToSee: true, ticketCode: "PP-OOU-301982", purchasedAt: "2026-10-10" },
      { eventId: "afrofest-culture-night", allowFriendsToSee: true, ticketCode: "PP-OOU-592817", purchasedAt: "2026-10-10" },
    ],
  },
  {
    id: "user-4",
    username: "bayo_tech",
    fullName: "Adebayo Johnson",
    email: "bayo@student.oouagoiwoye.edu.ng",
    role: "partygoer",
    campus: "OOU Ago-Iwoye",
    bio: "Computer Science '25 · Building hackathons & campus sound clashes",
    friends: ["tade_oou"],
    eventsAttending: [
      { eventId: "builders-hangout", allowFriendsToSee: true, ticketCode: "PP-OOU-990184", purchasedAt: "2026-10-10" },
    ],
  },
  {
    id: "user-5",
    username: "fassa_execs",
    fullName: "FASSA Social Committee",
    email: "social@fassa-oou.org",
    role: "organizer",
    campus: "OOU Ago-Iwoye",
    bio: "Official Social Directorate, Faculty of Science Students Association",
    friends: [],
    eventsAttending: [],
  },
];

const SEED_CIRCLES: PartyCircle[] = [
  {
    id: "circle-1",
    name: "Main Hall Sunset Clique",
    description: "Gathering at the quad lawn before heading to Mini Stadium for Sunset Sessions.",
    createdBy: "tade_oou",
    members: ["tade_oou", "fola_vibes", "chioma_k"],
    inviteCode: "SUNSET26",
    targetEventId: "after-class-sunset",
    isVotingOpen: false,
    suggestions: [
      {
        id: "sugg-1",
        eventId: "after-class-sunset",
        suggestedBy: "tade_oou",
        suggestedAt: "2026-10-09",
        votes: ["tade_oou", "fola_vibes", "chioma_k"],
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
        actorUsername: "tade_oou",
        description: "@tade_oou created the circle",
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
        actorUsername: "tade_oou",
        description: "@tade_oou suggested AFTER CLASS: Sunset Sessions",
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
        actorUsername: "tade_oou",
        description: "@tade_oou confirmed AFTER CLASS: Sunset Sessions as the circle's plan",
        timestamp: "2026-10-09T16:00:00Z",
        eventId: "after-class-sunset",
      },
    ],
    createdAt: "2026-10-09",
  },
  {
    id: "circle-2",
    name: "Law '25 Gala Squad",
    description: "Black-tie dinner table reservation and pre-drinks linkup.",
    createdBy: "fola_vibes",
    members: ["fola_vibes", "tade_oou"],
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
        suggestedBy: "tade_oou",
        suggestedAt: "2026-10-10",
        votes: ["tade_oou"],
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
        actorUsername: "tade_oou",
        description: "@tade_oou joined the circle",
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
        actorUsername: "tade_oou",
        description: "@tade_oou suggested AfroFest Night",
        timestamp: "2026-10-10T12:15:00Z",
        eventId: "afrofest-culture-night",
      },
    ],
    createdAt: "2026-10-10",
  },
];

interface AuthContextType {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  circles: PartyCircle[];
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

  // Modal controls
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [circleModalOpen, setCircleModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeTargetEventId, setActiveTargetEventId] = useState<string | undefined>(undefined);

  // Hydrate from localStorage on client mount
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
    } catch (e) {
      console.warn("Storage hydration error", e);
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
    const found = allUsers.find(
      (u) =>
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
      email: clean.includes("@") ? clean : `${clean}@student.oouagoiwoye.edu.ng`,
      role: "partygoer",
      campus: "OOU Ago-Iwoye",
      bio: "Active PartyPadi member · OOU Ago-Iwoye",
      friends: ["tade_oou", "fola_vibes"],
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
      campus: data.campus || "OOU Ago-Iwoye",
      bio: data.bio || (data.role === "partygoer" ? "Partygoer & campus vibe seeker" : "Verified campus event host"),
      friends: data.role === "partygoer" ? ["tade_oou", "fola_vibes"] : [], // Auto-connect with campus ambassadors
      eventsAttending: [],
    };

    const updatedList = [...allUsers, newUser];
    setAllUsers(updatedList);
    localStorage.setItem("pp_all_users", JSON.stringify(updatedList));
    saveUser(newUser);
    return true;
  };

  const logout = () => {
    saveUser(null);
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
        authModalOpen,
        circleModalOpen,
        profileModalOpen,
        activeTargetEventId,
        login,
        signup,
        logout,
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
