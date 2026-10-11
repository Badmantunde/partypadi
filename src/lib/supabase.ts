import { createClient } from "@supabase/supabase-js";

// Retrieve public Supabase environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Detect if valid configuration is provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("your-project-id") &&
  supabaseUrl.startsWith("http")
);

// Fallback dummy URL to prevent createClient initialization crash when unconfigured
const fallbackUrl = "https://placeholder-project.supabase.co";
const fallbackKey = "placeholder-anon-key";

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : fallbackUrl,
  isSupabaseConfigured ? supabaseAnonKey : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export interface SupabaseAuthResult {
  success: boolean;
  message: string;
  user?: unknown;
}

/**
 * Sign up with email and password via Supabase Auth
 */
export async function signUpWithEmail(
  email: string,
  password?: string,
  userData?: {
    fullName: string;
    username: string;
    role: "partygoer" | "organizer";
    campus: string;
  }
): Promise<SupabaseAuthResult> {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: "Supabase not connected yet. Operating in local demo mode.",
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: password || "PartyPadi2026!",
      options: {
        data: {
          full_name: userData?.fullName || "",
          username: userData?.username || "",
          role: userData?.role || "partygoer",
          campus: userData?.campus || "Main Campus",
        },
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Account created successfully. Check your email for verification.",
      user: data.user,
    };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || "Sign up failed" };
  }
}

/**
 * Sign in with email and password via Supabase Auth
 */
export async function signInWithEmail(
  email: string,
  password?: string
): Promise<SupabaseAuthResult> {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: "Supabase not connected yet. Operating in local demo mode.",
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || "PartyPadi2026!",
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Signed in successfully via Supabase.",
      user: data.user,
    };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || "Sign in failed" };
  }
}

/**
 * Sign in with magic link / OTP via Supabase Auth
 */
export async function signInWithOtp(email: string): Promise<SupabaseAuthResult> {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: "Demo magic link triggered.",
    };
  }

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Magic login link sent to your email!",
    };
  } catch (err: unknown) {
    return { success: false, message: (err as Error)?.message || "OTP request failed" };
  }
}

/**
 * Sign out from Supabase Auth
 */
export async function signOutUser(): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Supabase sign out error", err);
  }
}
