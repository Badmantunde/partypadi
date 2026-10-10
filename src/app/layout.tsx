import type { Metadata } from "next";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "PartyPadi — Your Campus. Your People. Your Next Experience.",
  description:
    "The campus-first event discovery and ticketing platform for Nigerian universities. Discover what's happening, get your tickets, and show up with your people.",
  keywords: [
    "campus events",
    "university party tickets",
    "OOU events",
    "campus ticketing Nigeria",
    "student events",
    "department week",
    "campus concert",
  ],
  authors: [{ name: "PartyPadi" }],
  openGraph: {
    title: "PartyPadi — Your Campus. Your People. Your Next Experience.",
    description:
      "From spontaneous link-ups to the biggest nights on campus. Discover what's happening, get your ticket, and show up.",
    siteName: "PartyPadi",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#11120F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col font-sans bg-white text-[#11120F] selection:bg-[#C5FF35] selection:text-[#11120F]">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
