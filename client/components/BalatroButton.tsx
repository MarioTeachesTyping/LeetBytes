"use client";

import { ReactNode } from "react";

interface BalatroButtonProps {
  children: ReactNode;
  variant?: "play" | "options" | "quit" | "collection" | "gray";
  onClick?: () => void;
  className?: string;
}

const variantStyles: Record<string, { bg: string; border: string }> = {
  play: {
    bg: "bg-[#2980d4]",
    border: "border-[#5ea8e8]",
  },
  options: {
    bg: "bg-[#e89830]",
    border: "border-[#f0b860]",
  },
  quit: {
    bg: "bg-[#d43030]",
    border: "border-[#e06060]",
  },
  collection: {
    bg: "bg-[#4a9a5a]",
    border: "border-[#70b880]",
  },
  gray: {
    bg: "bg-[#505860]",
    border: "border-[#707880]",
  },
};

export default function BalatroButton({
  children,
  variant = "play",
  onClick,
  className = "",
}: BalatroButtonProps) {
  const style = variantStyles[variant] ?? variantStyles.play;

  return (
    <button
      onClick={onClick}
      className={`
        relative px-13 py-7
        ${style.bg} ${style.border}
        border-2 rounded-lg
        shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),inset_0_-2px_3px_rgba(0,0,0,0.25),0_3px_6px_rgba(0,0,0,0.5)]
        hover:brightness-110
        active:scale-[0.97] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.4)]
        transition-all duration-100
        font-[family-name:var(--font-pixel)] text-white text-sm tracking-wider
        cursor-pointer select-none
        ${className}
      `}
    >
      <span className="relative z-10 drop-shadow-[1px_2px_2px_rgba(0,0,0,0.7)]">
        {children}
      </span>
    </button>
  );
}
