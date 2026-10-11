import React from "react";
import Image from "next/image";

interface PartyPadiLogoProps {
  className?: string;
  theme?: "light" | "dark";
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
}

export function PartyPadiLogo({
  className = "",
  theme = "dark",
  showTagline = false,
  size = "md",
  iconOnly = false,
}: PartyPadiLogoProps) {
  const isDark = theme === "dark";
  const logoSrc = isDark
    ? "/images/partypadi-logo-dark.png"
    : "/images/partypadi-logo-light.png";

  const sizeClasses = {
    sm: "h-7 w-auto",
    md: "h-8 sm:h-9 w-auto",
    lg: "h-10 sm:h-11 w-auto",
  };

  const iconSizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  const subtextColor = isDark ? "text-neutral-400" : "text-neutral-500";

  if (iconOnly) {
    return (
      <div className={`inline-flex items-center shrink-0 select-none ${className}`}>
        <Image
          src="/images/partypadi-icon.png"
          alt="PartyPadi Icon"
          width={120}
          height={120}
          className={`${iconSizeClasses[size]} object-contain`}
          priority
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col select-none ${className}`}>
      <div className="flex items-center">
        <Image
          src={logoSrc}
          alt="PartyPadi"
          width={400}
          height={98}
          className={`${sizeClasses[size]} object-contain`}
          priority
        />
      </div>
      {showTagline && (
        <span
          className={`text-[9px] font-mono tracking-widest uppercase mt-1 pl-1 ${subtextColor}`}
        >
          CAMPUS TICKETING & SOCIAL
        </span>
      )}
    </div>
  );
}
