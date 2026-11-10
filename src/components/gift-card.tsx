"use client";

import { Gift } from "@/lib/types";

function formatWon(amount: number) {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

export default function GiftCard({
  gift,
  onClick,
}: {
  gift: Gift;
  onClick: () => void;
}) {
  const percent = Math.round((gift.currentAmount / gift.price) * 100);
  const isComplete = gift.currentAmount >= gift.price;

  return (
    <button
      onClick={onClick}
      className="flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-transform active:scale-[0.98]"
    >
      <div
        className={`relative flex h-40 items-center justify-center ${gift.bgColor}`}
      >
        <span className="text-5xl">{gift.emoji}</span>
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-pink-500">
              🎉 달성 완료!
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-left text-sm font-bold text-gray-800">
          {gift.name}
        </h3>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-300 transition-all duration-500"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{percent}% 달성</span>
          <span className="font-semibold text-gray-800">
            {formatWon(gift.price)}
          </span>
        </div>
      </div>
    </button>
  );
}
