"use client";

import { Gift } from "@/lib/types";

function formatWon(amount: number) {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

const BG_COLORS: Record<string, string> = {
  "bg-pink-50": "from-[#ffe0f0] to-[#ffc8e0]",
  "bg-blue-50": "from-[#d8e8ff] to-[#c0d8ff]",
  "bg-green-50": "from-[#d8f8d0] to-[#c0eeb8]",
};

export default function GiftCard({
  gift,
  onClick,
}: {
  gift: Gift;
  onClick: () => void;
}) {
  const percent = Math.round((gift.currentAmount / gift.price) * 100);
  const isComplete = gift.currentAmount >= gift.price;
  const gradient = BG_COLORS[gift.bgColor] || "from-[#e0f0ff] to-[#d0e8ff]";

  return (
    <button
      onClick={onClick}
      className="y2k-window flex w-full cursor-pointer flex-col transition-transform hover:-translate-y-1 active:translate-y-0"
    >
      {/* Mini titlebar */}
      <div className="flex items-center gap-1 bg-gradient-to-r from-[#8cb4ff] to-[#a3c4ff] px-3 py-1.5">
        <div className="h-2 w-2 rounded-full bg-[#ff7070]" />
        <div className="h-2 w-2 rounded-full bg-[#ffcc4d]" />
        <div className="h-2 w-2 rounded-full bg-[#73e06e]" />
        <span className="ml-1 truncate text-[10px] font-bold text-white">
          {gift.name}
        </span>
      </div>

      {/* Emoji area */}
      <div className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${gradient}`}>
        <span className="text-5xl drop-shadow-md">{gift.emoji}</span>
        {gift.messages.length > 0 && (
          <span className="absolute top-2 right-2 flex items-center gap-0.5 rounded-full border-2 border-white bg-[var(--color-y2k-pink)] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            💬 {gift.messages.length}
          </span>
        )}
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-y2k-blue)]/50">
            <span className="rounded-full border-2 border-white bg-[var(--color-y2k-lime)] px-3 py-1.5 text-xs font-extrabold text-[#3a5a10] shadow-md">
              🎉 달성!
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 bg-white/80 p-3">
        <h3 className="text-left text-sm font-extrabold text-[var(--color-foreground)]">
          {gift.name}
        </h3>
        <div className="h-2.5 w-full overflow-hidden rounded-full border border-[var(--color-y2k-blue)]/30 bg-white">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-y2k-blue)] to-[var(--color-y2k-cyan)] transition-all duration-500"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-[var(--color-y2k-blue)]">
            ⭐ {percent}%
          </span>
          <span className="font-extrabold text-[var(--color-foreground)]">
            {formatWon(gift.price)}
          </span>
        </div>
      </div>
    </button>
  );
}
