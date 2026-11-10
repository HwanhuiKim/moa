"use client";

import { useState } from "react";
import { useGifts } from "@/lib/gift-context";
import ProfileCard from "./profile-card";
import GiftCard from "./gift-card";
import GiftDetailModal from "./gift-detail-modal";
import NicknameModal from "./nickname-modal";

export default function Wishlist() {
  const { gifts, nickname } = useGifts();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedGift = gifts.find((g) => g.id === selectedId) ?? null;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8">
      <NicknameModal />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">🎁 모아</h1>
        {nickname && (
          <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-500">
            {nickname}
          </span>
        )}
      </div>

      <ProfileCard />

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-500">위시리스트</h2>
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

      {selectedGift && (
        <GiftDetailModal
          gift={selectedGift}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
