"use client";

import { useState } from "react";
import { useGifts } from "@/lib/gift-context";
import ProfileCard from "./profile-card";
import GiftCard from "./gift-card";
import GiftDetailModal from "./gift-detail-modal";
import NicknameModal from "./nickname-modal";
import StarDecorations from "./star-decorations";

export default function Wishlist() {
  const { gifts, nickname } = useGifts();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedGift = gifts.find((g) => g.id === selectedId) ?? null;

  return (
    <>
      <StarDecorations />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8">
        <NicknameModal />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-y2k-blue-dark)]">
              moa
            </h1>
            <span className="float-animation text-lg">✨</span>
          </div>
          {nickname && (
            <span className="rounded-full border-2 border-[var(--color-y2k-blue)] bg-white/80 px-3 py-1 text-xs font-bold text-[var(--color-y2k-blue-dark)] shadow-sm">
              ⭐ {nickname}
            </span>
          )}
        </div>

        <ProfileCard />

        {/* Wishlist */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">💫</span>
            <h2 className="text-sm font-extrabold text-[var(--color-y2k-blue-dark)]">
              위시리스트
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {gifts.map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                onClick={() => setSelectedId(gift.id)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1 py-2 text-[10px] text-[var(--color-y2k-blue)]/40">
          <span>⭐</span>
          <span>moa - 마음을 모아 선물하기</span>
          <span>⭐</span>
        </div>

        {selectedGift && (
          <GiftDetailModal
            gift={selectedGift}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </>
  );
}
