import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0C0D0E] text-[#F5F5F0] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C5FF35]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />
          <span>404 // ROUTE NOT FOUND</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-medium text-5xl sm:text-7xl tracking-tight text-white leading-none">
            Lost on Campus?
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed pt-2">
            The page or event you&apos;re looking for doesn&apos;t exist or has moved to another hall.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="spicy-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C5FF35] text-[#11120F] hover:bg-[#b4f323] rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 border border-white/20 text-white hover:bg-white/15 rounded-full text-xs font-mono font-medium uppercase tracking-wider transition-all"
          >
            <Compass className="w-4 h-4 text-[#C5FF35]" />
            <span>Explore Events</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
