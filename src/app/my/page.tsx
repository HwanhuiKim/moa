"use client";

import { useState } from "react";
import { useGifts } from "@/lib/gift-context";
import { Gift } from "@/lib/types";
import Y2kWindow from "@/components/y2k-window";
import StarDecorations from "@/components/star-decorations";
import Link from "next/link";

const EMOJI_OPTIONS = ["🧑", "👩", "👨", "🧑‍🎤", "👸", "🤴", "🦄", "🐰", "🐱", "🌸"];
const BG_COLORS = ["bg-pink-50", "bg-blue-50", "bg-green-50", "bg-purple-50", "bg-yellow-50"];
const GIFT_EMOJIS = ["🎧", "💇‍♀️", "🥤", "👟", "💄", "📱", "🎮", "📚", "🧸", "🎒"];

export default function MyPage() {
  const { profile, updateProfile, gifts, addGift, removeGift, role } = useGifts();

  const [name, setName] = useState(profile.name);
  const [emoji, setEmoji] = useState(profile.emoji);
  const [message, setMessage] = useState(profile.message);
  const [profileSaved, setProfileSaved] = useState(false);

  const [productUrl, setProductUrl] = useState("");
  const [giftName, setGiftName] = useState("");
  const [giftPrice, setGiftPrice] = useState("");
  const [giftEmoji, setGiftEmoji] = useState("🎧");
  const [giftDesc, setGiftDesc] = useState("");
  const [giftImageUrl, setGiftImageUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [giftAdded, setGiftAdded] = useState(false);

  function handleSaveProfile() {
    updateProfile({ name: name.trim() || "이름 없음", emoji, message: message.trim() });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  async function handleFetchOg() {
    if (!productUrl.trim()) return;
    setFetching(true);
    setFetchError("");
    try {
      const res = await fetch("/api/og-scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.title) setGiftName(data.title);
        if (data.image) setGiftImageUrl(data.image);
        if (data.description) setGiftDesc(data.description);
        if (data.price) setGiftPrice(data.price.replace(/[^0-9]/g, ""));
      } else {
        setFetchError(data.error || "정보를 가져올 수 없습니다.");
      }
    } catch {
      setFetchError("네트워크 오류가 발생했습니다. 직접 입력해 주세요.");
    }
    setFetching(false);
  }

  function handleAddGift() {
    if (!giftName.trim() || !giftPrice.trim()) return;
    const newGift: Gift = {
      id: `gift-${Date.now()}`,
      name: giftName.trim(),
      price: parseInt(giftPrice, 10),
      imageUrl: giftImageUrl.trim(),
      emoji: giftEmoji,
      bgColor: BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)],
      description: giftDesc.trim() || `${giftName.trim()}을(를) 갖고 싶어요!`,
      productUrl: productUrl.trim(),
      currentAmount: 0,
      messages: [],
    };
    addGift(newGift);
    setProductUrl("");
    setGiftName("");
    setGiftPrice("");
    setGiftEmoji("🎧");
    setGiftDesc("");
    setGiftImageUrl("");
    setGiftAdded(true);
    setTimeout(() => setGiftAdded(false), 2000);
  }

  return (
    <>
      <StarDecorations />
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{"⚙️"}</span>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-y2k-blue-dark)]">
              내 설정
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border-2 border-[var(--color-y2k-blue)] bg-white/80 px-3 py-1 text-xs font-bold text-[var(--color-y2k-blue-dark)] shadow-sm transition-colors hover:bg-[var(--color-y2k-blue)] hover:text-white"
          >
            {"← 위시리스트"}
          </Link>
        </div>

        {/* Profile settings */}
        <Y2kWindow title="프로필 설정" icon="💫">
          <div className="flex flex-col gap-4">
            {/* Emoji picker */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[var(--color-y2k-blue-dark)]">
                프로필 이모지
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 text-xl transition-all ${
                      emoji === e
                        ? "border-[var(--color-y2k-pink)] bg-[var(--color-y2k-pink)]/20 scale-110"
                        : "border-[var(--color-y2k-blue)]/20 bg-white hover:border-[var(--color-y2k-blue)]"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[var(--color-y2k-blue-dark)]">
                이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                className="y2k-input w-full"
                placeholder="이름을 입력하세요"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[var(--color-y2k-blue-dark)]">
                환영 메시지
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={100}
                rows={2}
                className="y2k-input w-full resize-none"
                placeholder="방문자에게 보여줄 메시지"
              />
            </div>

            <button onClick={handleSaveProfile} className="y2k-btn w-full text-center">
              {profileSaved ? "✅ 저장 완료!" : "⭐ 프로필 저장"}
            </button>
          </div>
        </Y2kWindow>

        {/* Add gift */}
        <Y2kWindow title="선물 추가하기" icon="🎁">
          <div className="flex flex-col gap-4">
            {/* URL input */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[var(--color-y2k-blue-dark)]">
                상품 링크 (선택)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  className="y2k-input flex-1"
                  placeholder="쿠팡, 네이버, 무신사 링크"
                />
                <button
                  onClick={handleFetchOg}
                  disabled={fetching || !productUrl.trim()}
                  className="y2k-btn shrink-0 px-3 text-sm disabled:opacity-40"
                >
                  {fetching ? "..." : "자동입력"}
                </button>
              </div>
              {fetchError && (
                <p className="mt-1 text-xs text-[#e04060]">{fetchError}</p>
              )}
            </div>

            {/* Emoji picker for gift */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[var(--color-y2k-blue-dark)]">
                이모지
              </label>
              <div className="flex flex-wrap gap-2">
                {GIFT_EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setGiftEmoji(e)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border-2 text-lg transition-all ${
                      giftEmoji === e
                        ? "border-[var(--color-y2k-pink)] bg-[var(--color-y2k-pink)]/20 scale-110"
                        : "border-[var(--color-y2k-blue)]/20 bg-white hover:border-[var(--color-y2k-blue)]"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[var(--color-y2k-blue-dark)]">
                상품명 *
              </label>
              <input
                type="text"
                value={giftName}
                onChange={(e) => setGiftName(e.target.value)}
                className="y2k-input w-full"
                placeholder="갖고 싶은 선물 이름"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[var(--color-y2k-blue-dark)]">
                목표 금액 (원) *
              </label>
              <input
                type="number"
                value={giftPrice}
                onChange={(e) => setGiftPrice(e.target.value)}
                className="y2k-input w-full"
                placeholder="예: 359000"
                min={0}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[var(--color-y2k-blue-dark)]">
                설명 (선택)
              </label>
              <textarea
                value={giftDesc}
                onChange={(e) => setGiftDesc(e.target.value)}
                maxLength={100}
                rows={2}
                className="y2k-input w-full resize-none"
                placeholder="이 선물을 갖고 싶은 이유"
              />
            </div>

            {giftImageUrl && (
              <div className="flex items-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-y2k-blue)]/30 bg-white/60 p-2">
                <img
                  src={giftImageUrl}
                  alt="상품 이미지"
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <span className="text-xs text-[var(--color-foreground)]/60">이미지 미리보기</span>
              </div>
            )}

            <button
              onClick={handleAddGift}
              disabled={!giftName.trim() || !giftPrice.trim()}
              className="y2k-btn-pink y2k-btn w-full text-center disabled:opacity-40"
            >
              {giftAdded ? "✅ 추가 완료!" : "🎁 선물 추가"}
            </button>
          </div>
        </Y2kWindow>

        {/* Current gift list */}
        <Y2kWindow title={`등록된 선물 (${gifts.length})`} icon="📋">
          <div className="flex flex-col gap-3">
            {gifts.length === 0 ? (
              <p className="py-4 text-center text-sm text-[var(--color-foreground)]/40">
                아직 등록된 선물이 없어요.
              </p>
            ) : (
              gifts.map((gift) => (
                <div
                  key={gift.id}
                  className="flex items-center gap-3 rounded-xl border-2 border-[var(--color-y2k-blue)]/15 bg-white/70 p-3"
                >
                  <span className="text-2xl">{gift.emoji}</span>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-bold text-[var(--color-foreground)]">
                      {gift.name}
                    </span>
                    <span className="text-[11px] text-[var(--color-foreground)]/50">
                      {"₩"}{gift.price.toLocaleString("ko-KR")} / {gift.messages.length}개 메시지
                    </span>
                  </div>
                  <button
                    onClick={() => removeGift(gift.id)}
                    className="rounded-lg border-2 border-[#e04060]/30 bg-[#e04060]/10 px-2 py-1 text-xs font-bold text-[#e04060] transition-colors hover:bg-[#e04060]/20"
                  >
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>
        </Y2kWindow>

        {/* Role info */}
        <div className="rounded-xl border-2 border-dashed border-[var(--color-y2k-yellow)] bg-[var(--color-y2k-yellow)]/30 px-4 py-3 text-center text-xs text-[#8a7020]">
          현재 역할: <strong>{role === "owner" ? "주인" : role === "contributor" ? "참여자" : "방문자"}</strong>
          {" "}/ 프로필을 저장하면 이 기기에서 주인으로 인식됩니다.
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1 py-2 text-[10px] text-[var(--color-y2k-blue)]/40">
          <span>{"⭐"}</span>
          <span>moa - {"마음을 모아 선물하기"}</span>
          <span>{"⭐"}</span>
        </div>
      </div>
    </>
  );
}
