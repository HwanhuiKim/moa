"use client";

import { useState } from "react";
import { useGifts } from "@/lib/gift-context";
import ProfileCard from "./profile-card";
import GiftCard from "./gift-card";
import GiftDetailModal from "./gift-detail-modal";
import NicknameModal from "./nickname-modal";
import StarDecorations from "./star-decorations";
import AllMessages from "./all-messages";
import Link from "next/link";

type MainTab = "wishlist" | "messages";

export default function Wishlist() {
  const { gifts, nickname, role, myContributions } = useGifts();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<MainTab>("wishlist");
  const [copied, setCopied] = useState(false);

  const selectedGift = gifts.find((g) => g.id === selectedId) ?? null;
  const totalMessages = gifts.reduce((s, g) => s + g.messages.length, 0);

  function handleCopyLink() {
    try {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <>
      <StarDecorations />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8">
        <NicknameModal />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{"\u{1F381}"}</span>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-y2k-blue-dark)]">
              moa
            </h1>
            <span className="float-animation text-lg">{"✨"}</span>
          </div>
          <div className="flex items-center gap-2">
            {nickname && (
              <span className="rounded-full border-2 border-[var(--color-y2k-blue)] bg-white/80 px-3 py-1 text-xs font-bold text-[var(--color-y2k-blue-dark)] shadow-sm">
                {"⭐"} {nickname}
                {role === "contributor" && myContributions.length > 0 && (
                  <span className="ml-1 text-[var(--color-y2k-pink-dark)]">
                    {"💕"}{myContributions.length}
                  </span>
                )}
              </span>
            )}
            {role === "owner" && (
              <Link
                href="/my"
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--color-y2k-blue)] bg-white/80 text-sm shadow-sm transition-colors hover:bg-[var(--color-y2k-blue)] hover:text-white"
                title="설정"
              >
                {"⚙️"}
              </Link>
            )}
          </div>
        </div>

        <ProfileCard />

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopyLink}
            className="y2k-btn flex flex-1 items-center justify-center gap-1.5 text-sm"
          >
            {copied ? "✅ 복사 완료!" : "🔗 링크 복사"}
          </button>
          {role !== "owner" && (
            <Link
              href="/my"
              className="y2k-btn flex items-center justify-center gap-1 px-4 text-sm"
            >
              {"✨"} 나도 만들기
            </Link>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex overflow-hidden rounded-xl border-2 border-[var(--color-y2k-blue)]">
          <button
            onClick={() => setTab("wishlist")}
            className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-bold transition-colors ${
              tab === "wishlist"
                ? "bg-[var(--color-y2k-blue)] text-white"
                : "bg-white/70 text-[var(--color-y2k-blue)]"
            }`}
          >
            {"\u{1F4AB}"} {"위시리스트"}
          </button>
          <button
            onClick={() => setTab("messages")}
            className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-bold transition-colors ${
              tab === "messages"
                ? "bg-[var(--color-y2k-blue)] text-white"
                : "bg-white/70 text-[var(--color-y2k-blue)]"
            }`}
          >
            {"\u{1F4AC}"} {"전체 메시지"}
            {totalMessages > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                  tab === "messages"
                    ? "bg-white/30 text-white"
                    : "bg-[var(--color-y2k-pink)] text-white"
                }`}
              >
                {totalMessages}
              </span>
            )}
          </button>
        </div>

        {/* Tab content */}
        {tab === "wishlist" ? (
          <div className="flex flex-col gap-3">
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
        ) : (
          <AllMessages />
        )}

        {/* Footer */}
        <div className="flex items-center justify-center gap-1 py-2 text-[10px] text-[var(--color-y2k-blue)]/40">
          <span>{"⭐"}</span>
          <span>moa - {"마음을 모아 선물하기"}</span>
          <span>{"⭐"}</span>
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
