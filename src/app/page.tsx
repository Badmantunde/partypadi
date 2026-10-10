import { EVENTS } from "@/data/events";
import { LandingPageClient } from "@/components/LandingPageClient";

export default function Home() {
  return <LandingPageClient initialEvents={EVENTS} />;
}
