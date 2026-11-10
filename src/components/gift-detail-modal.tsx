"use client";

import { useState, useEffect, useRef } from "react";
import { Gift, FundMessage } from "@/lib/types";
import { useGifts } from "@/lib/gift-context";

function formatWon(amount: number) {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "방금 전";
  if (mins < 60) return `${mins}분 전`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

const QUICK_AMOUNTS = [5000, 10000, 25000];

const BUBBLE_COLORS = [
  "bg-pink-100 text-pink-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-yellow-100 text-yellow-700",
  "bg-orange-100 text-orange-700",
];

function FloatingMessages({ messages }: { messages: FundMessage[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-8">
        <p className="text-sm text-gray-300">아직 메시지가 없어요. 첫 번째 마음을 보내보세요!</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative flex flex-1 flex-col gap-3 overflow-y-auto px-1 py-4">
      {messages.map((msg, i) => {
        const isRight = i % 2 === 1;
        const color = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
        return (
          <div
            key={msg.id}
            className={`flex flex-col gap-0.5 animate-[fadeUp_0.4s_ease-out] ${isRight ? "items-end" : "items-start"}`}
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
          >
            <span className="px-2 text-[10px] font-medium text-gray-400">
              {msg.nickname}
            </span>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${color}`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
            <div className={`flex items-center gap-2 px-2 ${isRight ? "flex-row-reverse" : ""}`}>
              <span className="text-[10px] font-semibold text-pink-400">
                {formatWon(msg.amount)}
              </span>
              <span className="text-[10px] text-gray-300">{timeAgo(msg.createdAt)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function GiftDetailModal({
  gift,
  onClose,
}: {
  gift: Gift;
  onClose: () => void;
}) {
  const { fund } = useGifts();
  const [inputValue, setInputValue] = useState("");
  const [messageText, setMessageText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"messages" | "fund">("messages");

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

    const success = fund(gift.id, amount, messageText.trim());
    if (success) {
      setShowSuccess(true);
      setInputValue("");
      setMessageText("");
      setError("");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <div
        className="flex h-[85vh] w-full max-w-md flex-col rounded-t-3xl bg-white sm:h-auto sm:max-h-[85vh] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ${gift.bgColor}`}>
              {gift.emoji}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">{gift.name}</h2>
              <p className="text-xs text-gray-400">{percent}% 달성 · {formatWon(gift.currentAmount)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 프로그레스 바 */}
        <div className="px-6 pt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-300 transition-all duration-500"
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-1 px-6 pt-4">
          <button
            onClick={() => setTab("messages")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              tab === "messages"
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            메시지 ({gift.messages.length})
          </button>
          <button
            onClick={() => setTab("fund")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              tab === "fund"
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            참여하기
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="flex min-h-0 flex-1 flex-col px-6 pb-6">
          {tab === "messages" ? (
            <FloatingMessages messages={gift.messages} />
          ) : isComplete ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl">
              <span className="text-4xl">🎉</span>
              <p className="font-bold text-pink-600">목표 금액 달성!</p>
              <p className="text-sm text-pink-500">모두의 마음이 모였어요!</p>
            </div>
          ) : showSuccess ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl">
              <span className="text-4xl">💝</span>
              <p className="font-bold text-green-600">마음 전달 완료!</p>
              <p className="text-sm text-green-500">감사합니다!</p>
              <button
                onClick={() => { setShowSuccess(false); setTab("messages"); }}
                className="mt-2 rounded-full bg-green-500 px-6 py-2 text-sm font-semibold text-white"
              >
                메시지 보기
              </button>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-4 pt-4">
              {/* 메시지 입력 */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500">한마디 남기기</label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="축하 메시지, 응원의 한마디를 남겨보세요!"
                  maxLength={100}
                  rows={2}
                  className="resize-none rounded-xl border-2 border-gray-200 px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-300 focus:border-pink-300"
                />
                <p className="text-right text-[10px] text-gray-300">{messageText.length}/100</p>
              </div>

              {/* 빠른 선택 */}
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
              <div className="flex flex-col gap-1.5">
                <div className="flex overflow-hidden rounded-xl border-2 border-gray-200 focus-within:border-pink-300">
                  <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-400">{"₩"}</span>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); setError(""); }}
                    placeholder="금액을 입력하세요"
                    className="w-full px-3 py-3 text-sm outline-none"
                    min={0}
                    max={remaining}
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <p className="text-xs text-gray-400">남은 금액: {formatWon(remaining)}</p>
              </div>

              {/* 참여 버튼 */}
              <button
                onClick={handleSubmit}
                className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-pink-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-200 transition-transform active:scale-[0.98]"
              >
                마음 보내기 💌
              </button>

              <div className="rounded-xl bg-yellow-50 px-4 py-2.5 text-center text-[11px] text-yellow-700">
                이것은 모의 체험입니다. 실제 결제는 진행되지 않아요.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
