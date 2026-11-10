"use client";

import { useState } from "react";
import { Gift } from "@/lib/types";
import { useGifts } from "@/lib/gift-context";

function formatWon(amount: number) {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

const QUICK_AMOUNTS = [5000, 10000, 25000];

export default function GiftDetailModal({
  gift,
  onClose,
}: {
  gift: Gift;
  onClose: () => void;
}) {
  const { fund } = useGifts();
  const [inputValue, setInputValue] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const remaining = gift.price - gift.currentAmount;
  const percent = Math.round((gift.currentAmount / gift.price) * 100);
  const isComplete = gift.currentAmount >= gift.price;

  function handleQuickAmount(amount: number) {
    setInputValue(amount.toString());
    setError("");
  }

  function handleSubmit() {
    const amount = parseInt(inputValue, 10);
    if (!amount || amount <= 0) {
      setError("금액을 입력해 주세요.");
      return;
    }
    if (amount > remaining) {
      setError(`남은 금액(${formatWon(remaining)})을 초과할 수 없어요.`);
      return;
    }

    const success = fund(gift.id, amount);
    if (success) {
      setShowSuccess(true);
      setInputValue("");
      setError("");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-md flex-col gap-5 rounded-t-3xl bg-white p-6 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-gray-800">{gift.name}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 이모지 & 설명 */}
        <div className="flex gap-4">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-3xl ${gift.bgColor}`}
          >
            {gift.emoji}
          </div>
          <p className="text-sm leading-relaxed text-gray-500">
            {gift.description}
          </p>
        </div>

        {/* 진행률 */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">모금 현황</span>
            <span className="font-semibold text-gray-800">
              {formatWon(gift.currentAmount)} / {formatWon(gift.price)}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-300 transition-all duration-500"
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
          <p className="text-right text-xs text-gray-400">{percent}% 달성</p>
        </div>

        {/* 모의 안내 */}
        <div className="rounded-xl bg-yellow-50 px-4 py-3 text-center text-xs text-yellow-700">
          💡 이것은 모의 체험입니다. 실제 결제는 진행되지 않아요.
        </div>

        {isComplete ? (
          <div className="flex flex-col items-center gap-2 rounded-xl bg-pink-50 py-6">
            <span className="text-3xl">🎉</span>
            <p className="font-bold text-pink-600">축하합니다!</p>
            <p className="text-sm text-pink-500">
              목표 금액이 모두 달성되었어요!
            </p>
          </div>
        ) : showSuccess ? (
          <div className="flex flex-col items-center gap-2 rounded-xl bg-green-50 py-6">
            <span className="text-3xl">💝</span>
            <p className="font-bold text-green-600">참여 완료!</p>
            <p className="text-sm text-green-500">
              마음이 잘 전달되었어요. 감사합니다!
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-2 rounded-full bg-green-500 px-6 py-2 text-sm font-semibold text-white"
            >
              더 참여하기
            </button>
          </div>
        ) : (
          <>
            {/* 빠른 선택 버튼 */}
            <div className="flex gap-2">
              {QUICK_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleQuickAmount(amount)}
                  disabled={amount > remaining}
                  className="flex-1 rounded-xl border-2 border-pink-100 py-2.5 text-sm font-semibold text-pink-500 transition-colors hover:bg-pink-50 disabled:border-gray-100 disabled:text-gray-300"
                >
                  {formatWon(amount)}
                </button>
              ))}
            </div>

            {/* 직접 입력 */}
            <div className="flex flex-col gap-2">
              <div className="flex overflow-hidden rounded-xl border-2 border-gray-200 focus-within:border-pink-300">
                <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-400">
                  ₩
                </span>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setError("");
                  }}
                  placeholder="금액을 입력하세요"
                  className="w-full px-3 py-3 text-sm outline-none"
                  min={0}
                  max={remaining}
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <p className="text-xs text-gray-400">
                남은 금액: {formatWon(remaining)}
              </p>
            </div>

            {/* 참여하기 버튼 */}
            <button
              onClick={handleSubmit}
              className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-pink-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-200 transition-transform active:scale-[0.98]"
            >
              참여하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
