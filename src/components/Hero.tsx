"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface HeroProps {
  onOpenHostModal: () => void;
  onSelectEvent: (eventId: string) => void;
}

export function Hero({ onOpenHostModal, onSelectEvent }: HeroProps) {
  const cardsContainerRef = React.useRef<HTMLDivElement>(null);
  const centerCardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const centerHeroCard = () => {
      const container = cardsContainerRef.current;
      const centerEl = centerCardRef.current;
      if (!container || !centerEl) return;

      if (container.scrollWidth > container.clientWidth) {
        const cardLeft = centerEl.offsetLeft;
        const cardWidth = centerEl.offsetWidth;
        const containerWidth = container.clientWidth;
        const targetScroll = cardLeft - (containerWidth / 2) + (cardWidth / 2);

        container.scrollLeft = Math.max(0, targetScroll);
      }
    };

    // Center immediately on load
    centerHeroCard();

    // Re-verify after layout paint and image measurements
    const rAF = requestAnimationFrame(centerHeroCard);
    const t1 = setTimeout(centerHeroCard, 50);
    const t2 = setTimeout(centerHeroCard, 200);

    window.addEventListener("resize", centerHeroCard);
    return () => {
      cancelAnimationFrame(rAF);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", centerHeroCard);
    };
  }, []);

  const cards = [
    {
      id: "green-room-sessions",
      title: "The Green Room",
      subtitle: "Afro-House & Alte",
      venue: "Sub-Zero Lounge",
      price: "₦3,000",
      bgGradient: "from-[#4F46E5] to-[#7C3AED]",
      badgeColor: "bg-[#818CF8]/30 text-white",
      rotation: "sm:-rotate-12",
      translateY: "sm:translate-y-12",
      translateX: "sm:-translate-x-12",
      zIndex: "z-10",
      image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "campus-unplugged",
      title: "Campus Unplugged",
      subtitle: "Acoustic & Poetry",
      venue: "Arts Quad Lawn",
      price: "₦1,500",
      bgGradient: "from-[#E11D48] via-[#EA580C] to-[#BE185D]",
      badgeColor: "bg-[#FB7185]/30 text-white",
      rotation: "sm:-rotate-6",
      translateY: "sm:translate-y-4",
      translateX: "sm:-translate-x-4",
      zIndex: "z-15",
      image: "/images/concert-live.jpg",
    },
    {
      id: "after-class-sunset",
      title: "After Class",
      subtitle: "Sunset Sessions",
      venue: "Mini Stadium Lawn",
      price: "₦2,500",
      bgGradient: "from-[#0891B2] via-[#0D9488] to-[#0284C7]",
      badgeColor: "bg-[#22D3EE]/30 text-white",
      rotation: "sm:rotate-0",
      translateY: "sm:-translate-y-2",
      translateX: "sm:translate-x-0",
      zIndex: "z-25",
      isCenter: true,
      image: "/images/hero-student.jpg",
    },
    {
      id: "fassa-dinner-awards",
      title: "FASSA Gala '26",
      subtitle: "Annual Black-Tie Dinner",
      venue: "Heritage Grand Hall",
      price: "₦5,000",
      bgGradient: "from-[#16A34A] via-[#059669] to-[#0D9488]",
      badgeColor: "bg-[#4ADE80]/30 text-white",
      rotation: "sm:rotate-6",
      translateY: "sm:translate-y-4",
      translateX: "sm:translate-x-4",
      zIndex: "z-15",
      image: "/images/dinner-gala.jpg",
    },
    {
      id: "afrofest-culture-night",
      title: "AfroFest Night",
      subtitle: "Pan-African Culture",
      venue: "Main Amphitheatre",
      price: "Free Pass",
      bgGradient: "from-[#2563EB] to-[#6366F1]",
      badgeColor: "bg-[#60A5FA]/30 text-white",
      rotation: "sm:rotate-12",
      translateY: "sm:translate-y-12",
      translateX: "sm:translate-x-12",
      zIndex: "z-10",
      image: "/images/friends-linkup.jpg",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden bg-[#0C0D0E] text-white pt-12 sm:pt-20 pb-12 sm:pb-24 border-b border-white/10">
      {/* Background Star & Sparkle Ambient Details */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        {/* Soft radial glow behind center */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-b from-[#C5FF35]/8 via-[#0891B2]/5 to-transparent blur-3xl rounded-full" />

        {/* Ambient Subtle Accent Nodes */}
        <span className="absolute top-16 left-[12%] w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
        <span className="absolute top-36 right-[15%] w-1 h-1 rounded-full bg-white/25" />
        <span className="absolute top-28 left-[28%] w-1 h-1 rounded-full bg-white/30" />
        <span className="absolute top-52 right-[25%] w-1.5 h-1.5 rounded-full bg-[#C5FF35]/40" />
        <span className="absolute top-64 left-[18%] w-1 h-1 rounded-full bg-white/20" />
        <span className="absolute top-48 left-[82%] w-1 h-1 rounded-full bg-white/25" />
      </div>

      <div className="relative max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* 1. Eyebrow Pill (Reference: Early Access — Build Your Identity) */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-wider text-white/80 shadow-inner backdrop-blur-md mb-6 sm:mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35] animate-pulse" />
          <span>EARLY ACCESS — LIVE ON CAMPUS</span>
        </div>

        {/* 2. Main Display Headline with Editorial Serif Contrast (Reference Style) */}
        <div className="relative max-w-4xl mx-auto space-y-2">
          {/* Floating Attendee Cursor 1 (Left) */}
          <div className="hidden md:flex absolute -left-8 lg:-left-16 top-2 items-center gap-1.5 select-none animate-bounce duration-1000">
            {/* Custom Mouse Cursor Pointer Arrow */}
            <svg
              className="w-4 h-4 text-[#22D3EE] drop-shadow-md -rotate-45"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            </svg>
            <span className="px-2.5 py-0.5 rounded-md bg-[#22D3EE] text-[#0C0D0E] text-[11px] font-mono font-bold shadow-md">
              Tade (Biochem &apos;26)
            </span>
          </div>

          {/* Floating Attendee Cursor 2 (Right) */}
          <div className="hidden md:flex absolute -right-8 lg:-right-16 top-14 items-center gap-1.5 select-none animate-bounce duration-1000 delay-500">
            {/* Custom Mouse Cursor Pointer Arrow */}
            <svg
              className="w-4 h-4 text-[#C5FF35] drop-shadow-md -rotate-45"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            </svg>
            <span className="px-2.5 py-0.5 rounded-md bg-[#C5FF35] text-[#0C0D0E] text-[11px] font-mono font-bold shadow-md">
              Chioma (Law &apos;25)
            </span>
          </div>

          <h1 className="font-display font-medium text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] tracking-tight leading-[0.96] text-white">
            Your Campus. Your People.
            <br />
            <span className="font-serif italic font-normal tracking-normal text-[#C5FF35]">
              Your Next
            </span>{" "}
            <span className="font-sans font-medium text-white">Experience.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-white/60 leading-relaxed pt-3 font-normal">
            Join the campus-first event discovery and ticketing platform where nights come alive — find your people, get instant digital passes, and show up for what matters.
          </p>

          {/* Quick CTAs */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <a
              href="#events"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-[#0C0D0E] hover:bg-[#C5FF35] rounded-full text-xs font-mono font-bold tracking-tight transition-all shadow-lg"
            >
              <span>Explore Events</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={onOpenHostModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-mono text-white/70 hover:text-white transition-colors"
            >
              <span>Host an Event</span>
              <span className="text-[10px]">→</span>
            </button>
          </div>
        </div>

        {/* 3. The Fanned Event Cards Deck (Reference: The 5 Rising Rounded Cards Arc) */}
        <div className="relative w-full max-w-6xl mt-12 sm:mt-16 pt-6 pb-2">
          {/* Floating 3D Megaphone Sticker (Left side of card fan) */}
          <div className="hidden sm:block absolute -top-8 left-4 lg:left-12 z-30 w-20 h-20 lg:w-24 lg:h-24 pointer-events-none drop-shadow-2xl">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-transparent transform -rotate-12 animate-pulse duration-700">
              <Image
                src="/images/sticker-megaphone.jpg"
                alt="3D sound megaphone sticker"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Floating 3D Ticket Scanner Terminal Sticker (Right side of card fan) */}
          <div className="hidden sm:block absolute -top-8 right-4 lg:right-12 z-30 w-20 h-20 lg:w-24 lg:h-24 pointer-events-none drop-shadow-2xl">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-transparent transform rotate-12 animate-pulse duration-700 delay-300">
              <Image
                src="/images/sticker-scanner.jpg"
                alt="3D ticket scanner pass sticker"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Cards Arc Container */}
          <div
            ref={cardsContainerRef}
            className="flex sm:flex-row flex-nowrap items-end justify-start lg:justify-center overflow-x-auto lg:overflow-visible pt-12 pb-8 sm:pt-6 sm:pb-2 px-6 sm:px-0 gap-4 sm:gap-0 scrollbar-none snap-x snap-mandatory"
          >
            {cards.map((card) => {
              const isCenter = card.isCenter;

              return (
                <div
                  key={card.id}
                  ref={isCenter ? centerCardRef : undefined}
                  onClick={() => onSelectEvent(card.id)}
                  className={`relative shrink-0 snap-center my-1 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 hover:z-40 hover:rotate-0 hover:-translate-y-6 cursor-pointer border border-white/20 ${card.zIndex} ${card.rotation} ${card.translateY} ${card.translateX} ${
                    isCenter
                      ? "w-[260px] sm:w-[280px] h-[360px] sm:h-[400px] ring-2 ring-[#C5FF35]/80"
                      : "w-[220px] sm:w-[240px] h-[320px] sm:h-[350px] opacity-90 hover:opacity-100"
                  } bg-gradient-to-b ${card.bgGradient}`}
                >
                  {/* Background Ambient Imagery Overlay */}
                  <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Gradient Lighting Shading */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Bar of Card */}
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h4 className="font-display font-black text-lg sm:text-xl text-white leading-tight drop-shadow-sm">
                        {card.title}
                      </h4>
                      <p className="text-[11px] text-white/80 font-mono tracking-tight">
                        {card.subtitle}
                      </p>
                    </div>

                    {/* Top Action Pill (Reference: Center card has 'Get Started ↗') */}
                    {isCenter ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(card.id);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-white text-[#0C0D0E] rounded-full text-[11px] font-mono font-bold hover:bg-[#C5FF35] transition-colors shadow-lg"
                      >
                        <span>Get Tickets</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 text-[#C5FF35] border border-white/10 backdrop-blur-xs">
                        {card.price}
                      </span>
                    )}
                  </div>

                  {/* Center Visual Space (Character / Event Focus) */}
                  <div className="relative z-10 flex-1 my-3 flex items-center justify-center">
                    <div className="relative w-full h-full max-h-[170px] rounded-xl overflow-hidden border border-white/20 shadow-md">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover filter contrast-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  </div>

                  {/* Bottom Metadata of Card */}
                  <div className="relative z-10 pt-2 border-t border-white/20 flex items-center justify-between text-white">
                    <div className="truncate pr-2">
                      <span className="font-mono text-[9px] text-white/70 block uppercase tracking-wider">
                        VENUE
                      </span>
                      <span className="font-display font-bold text-xs truncate block">
                        {card.venue}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-[9px] text-white/70 block uppercase tracking-wider">
                        PASS
                      </span>
                      <span className="font-mono text-xs font-bold text-[#C5FF35]">
                        {card.price}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick hint on mobile */}
          <p className="sm:hidden text-center text-[10px] font-mono text-white/40 mt-3 uppercase tracking-wider">
            Swipe cards to explore campus events →
          </p>
        </div>
      </div>
    </section>
  );
}
