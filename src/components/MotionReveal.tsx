"use client";

import React, { useEffect, useRef, useState } from "react";

interface MotionRevealProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function MotionReveal({
  children,
  className = "",
  delayMs = 0,
  direction = "up",
}: MotionRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const current = elementRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const getTransform = () => {
    if (isVisible) return "translate-x-0 translate-y-0 scale-100 opacity-100";
    switch (direction) {
      case "up":
        return "translate-y-8 opacity-0";
      case "down":
        return "-translate-y-8 opacity-0";
      case "left":
        return "translate-x-8 opacity-0";
      case "right":
        return "-translate-x-8 opacity-0";
      default:
        return "opacity-0 scale-98";
    }
  };

  return (
    <div
      ref={elementRef}
      style={{
        transitionDelay: `${delayMs}ms`,
        transitionDuration: "850ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`transition-all ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
}

interface SplitTextProps {
  text: string;
  className?: string;
  delayStartMs?: number;
  wordClassName?: string;
}

export function SplitTextReveal({
  text,
  className = "",
  delayStartMs = 100,
  wordClassName = "",
}: SplitTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    const current = containerRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const words = text.split(" ");

  return (
    <div ref={containerRef} className={`inline-flex flex-wrap gap-x-[0.3em] gap-y-1 ${className}`}>
      {words.map((word, idx) => {
        const delay = delayStartMs + idx * 35;
        return (
          <span
            key={idx}
            style={{
              transitionDelay: `${delay}ms`,
              transitionDuration: "700ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className={`inline-block transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            } ${wordClassName}`}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}
