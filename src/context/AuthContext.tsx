"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, PartyCircle } from "@/types";

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
    targetEventId: "after-class-sunset",
    createdAt: "2026-10-09",
  },
  {
    id: "circle-2",
    name: "Law '25 Gala Squad",
    description: "Black-tie dinner table reservation and pre-drinks linkup.",
    createdBy: "fola_vibes",
    members: ["fola_vibes", "tade_oou"],
    targetEventId: "fassa-dinner-awards",
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
  createCircle: (data: {
    name: string;
    description?: string;
    members: string[];
    targetEventId?: string;
  }) => PartyCircle;
  joinCircle: (circleId: string) => void;
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

  const createCircle = (data: {
    name: string;
    description?: string;
    members: string[];
    targetEventId?: string;
  }): PartyCircle => {
    const newCircle: PartyCircle = {
      id: `circle-${Date.now()}`,
      name: data.name.trim(),
      description: data.description?.trim(),
      createdBy: currentUser ? currentUser.username : "guest",
      members: currentUser
        ? Array.from(new Set([currentUser.username, ...data.members]))
        : data.members,
      targetEventId: data.targetEventId,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const updatedCircles = [newCircle, ...circles];
    setCircles(updatedCircles);
    localStorage.setItem("pp_circles", JSON.stringify(updatedCircles));
    return newCircle;
  };

  const joinCircle = (circleId: string) => {
    if (!currentUser) return;
    const updatedCircles = circles.map((c) => {
      if (c.id === circleId && !c.members.includes(currentUser.username)) {
        return { ...c, members: [...c.members, currentUser.username] };
      }
      return c;
    });
    setCircles(updatedCircles);
    localStorage.setItem("pp_circles", JSON.stringify(updatedCircles));
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
        createCircle,
        joinCircle,
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
