"use client";

import React, { useState } from "react";
import { CAMPUS_OPTIONS } from "@/data/events";
import { EventCategory } from "@/types";
import { ChevronDown } from "lucide-react";

interface CampusDiscoveryStripProps {
  selectedCategory: EventCategory;
  onSelectCategory: (cat: EventCategory) => void;
  selectedCampusId: string;
  onSelectCampusId: (id: string) => void;
}

export function CampusDiscoveryStrip({
  selectedCategory,
  onSelectCategory,
  selectedCampusId,
  onSelectCampusId,
}: CampusDiscoveryStripProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeCampus =
    CAMPUS_OPTIONS.find((c) => c.id === selectedCampusId) || CAMPUS_OPTIONS[0];

  const categories: { id: EventCategory; label: string }[] = [
    { id: "all", label: "All Events" },
    { id: "parties", label: "Parties & Club Nights" },
    { id: "concerts", label: "Concerts & Live Sets" },
    { id: "dinners", label: "Dinners & Galas" },
    { id: "department-week", label: "Department Week" },
    { id: "cultural", label: "Cultural Events" },
    { id: "networking", label: "Builders & Networking" },
  ];

  return (
    <section className="w-full border-b border-neutral-200 bg-white">
      {/* Top Editorial Ticker Bar */}
      <div className="border-b border-neutral-800 px-4 sm:px-6 lg:px-8 py-2.5 bg-[#11120F] text-[#F5F5F0] overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono tracking-widest uppercase">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#C5FF35] animate-pulse" />
            <span className="font-bold text-white">YOUR CAMPUS IS CALLING.</span>
            <span className="hidden sm:inline text-[#8E8F89]">
              SOMETHING IS ALWAYS HAPPENING.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#DADBD4]">
            <span className="hidden md:inline">
              CAMPUS STATUS: <span className="text-[#C5FF35]">OOU AGO-IWOYE LIVE</span>
            </span>
            <span className="text-white/60">VOL. 01 / 2026</span>
          </div>
        </div>
      </div>

      {/* Campus Selector & Category Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Campus Selector Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 px-4 py-2 bg-neutral-100/80 hover:bg-neutral-200/60 border border-neutral-200 rounded-full text-xs font-mono font-medium transition-all shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-[#C5FF35]" />
              <span className="font-bold text-[#11120F]">
                {activeCampus.name} ({activeCampus.shortName})
              </span>
              <span className="text-[10px] text-[#5C5E57]">· {activeCampus.location}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#5C5E57] ml-1" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-neutral-200 rounded-2xl shadow-2xl z-30 p-2 space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-[#8E8F89] border-b border-neutral-100">
                  AVAILABLE UNIVERSITIES
                </div>
                {CAMPUS_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectCampusId(c.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                      c.id === activeCampus.id
                        ? "bg-[#11120F] text-white"
                        : "hover:bg-neutral-100 text-[#11120F]"
                    }`}
                  >
                    <div>
                      <div className="font-medium">
                        {c.name} ({c.shortName})
                      </div>
                      <div
                        className={`text-[10px] font-mono ${
                          c.id === activeCampus.id ? "text-[#C5FF35]" : "text-[#5C5E57]"
                        }`}
                      >
                        {c.location}
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                        c.status === "active"
                          ? "bg-[#C5FF35] text-[#11120F]"
                          : "bg-black/10 text-[#5C5E57]"
                      }`}
                    >
                      {c.status === "active" ? "NOW LIVE" : "NEXT"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Understated Category Filter Strip (Pill Buttons) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 py-1.5 text-xs font-mono tracking-tight uppercase whitespace-nowrap transition-all rounded-full border ${
                    isActive
                      ? "border-[#11120F] bg-[#11120F] text-white shadow-sm"
                      : "border-neutral-200/80 text-[#5C5E57] hover:text-[#11120F] hover:border-neutral-300 bg-neutral-50/60"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#C5FF35]" />}
                    <span>{cat.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
