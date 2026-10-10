import React from "react";

interface PartyPadiLogoProps {
  className?: string;
  theme?: "light" | "dark";
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export function PartyPadiLogo({
  className = "",
  theme = "light",
  showTagline = false,
  size = "md",
}: PartyPadiLogoProps) {
  const isDark = theme === "dark";
  const textColor = isDark ? "text-[#F5F5F0]" : "text-[#11120F]";
  const subtextColor = isDark ? "text-[#8E8F89]" : "text-[#5C5E57]";

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  };

  const textSizes = {
    sm: "text-base tracking-tight",
    md: "text-lg tracking-tight",
    lg: "text-2xl tracking-tight",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Swiss geometric monogram badge */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center bg-[#11120F] border border-black/15 overflow-hidden shrink-0`}
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] font-black tracking-tighter text-white">
          PP
        </span>
        {/* Signature electric neon lime dot indicator */}
        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#C5FF35] rounded-none" />
      </div>

      <div className="flex flex-col leading-none">
        <div className={`font-display font-black uppercase ${textSizes[size]} ${textColor} flex items-center`}>
          <span>PARTY</span>
          <span className="ml-1 text-[#11120F] dark:text-white">PADI</span>
          {/* Subtle neon lime editorial bullet */}
          <span className="w-1.5 h-1.5 bg-[#C5FF35] ml-1 inline-block" />
        </div>
        {showTagline && (
          <span className={`text-[9px] font-mono tracking-widest uppercase mt-0.5 ${subtextColor}`}>
            CAMPUS TICKETING // OOU
          </span>
        )}
      </div>
    </div>
  );
}
