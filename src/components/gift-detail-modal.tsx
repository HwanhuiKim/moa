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

const BUBBLE_STYLES = [
  { bg: "bg-[#ffe0f0]", border: "border-[#ffaed7]", text: "text-[#8a3060]" },
  { bg: "bg-[#d8e8ff]", border: "border-[#7ba1ff]", text: "text-[#2a4080]" },
  { bg: "bg-[#e0ffd8]", border: "border-[#a8e6a3]", text: "text-[#2a6020]" },
  { bg: "bg-[#f0e0ff]", border: "border-[#c4a8ff]", text: "text-[#4a2080]" },
  { bg: "bg-[#fff8d0]", border: "border-[#ffe070]", text: "text-[#6a5020]" },
  { bg: "bg-[#d8f8ff]", border: "border-[#a3e4ff]", text: "text-[#205060]" },
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
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8">
        <span className="text-3xl">💌</span>
        <p className="text-sm text-[var(--color-y2k-blue)]/50">
          아직 메시지가 없어요. 첫 번째 마음을 보내보세요!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-1 flex-col gap-4 overflow-y-auto py-4"
    >
      {messages.map((msg, i) => {
        const isRight = i % 2 === 1;
        const style = BUBBLE_STYLES[i % BUBBLE_STYLES.length];
        return (
          <div
            key={msg.id}
            className={`flex flex-col gap-1 animate-[fadeUp_0.4s_ease-out] ${isRight ? "items-end" : "items-start"}`}
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
          >
            {/* Nickname badge */}
            <span className="rounded-full border border-[var(--color-y2k-blue)]/20 bg-white/80 px-2.5 py-0.5 text-[10px] font-bold text-[var(--color-y2k-blue-dark)]">
              {msg.nickname}
            </span>
            {/* Bubble */}
            <div
              className={`max-w-[80%] rounded-2xl border-2 px-4 py-3 shadow-sm ${style.bg} ${style.border}`}
            >
              <p className={`text-sm font-medium leading-relaxed ${style.text}`}>
                {msg.text}
              </p>
            </div>
            {/* Meta */}
            <div className={`flex items-center gap-2 px-1 ${isRight ? "flex-row-reverse" : ""}`}>
              <span className="text-[10px] font-extrabold text-[var(--color-y2k-pink-dark)]">
                {formatWon(msg.amount)}
              </span>
              <span className="text-[10px] text-[var(--color-foreground)]/30">
                {timeAgo(msg.createdAt)}
              </span>
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
        className="y2k-window flex h-[85vh] w-full max-w-md flex-col sm:h-auto sm:max-h-[85vh]"
        style={{ borderRadius: "16px 16px 0 0" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Titlebar */}
        <div className="y2k-titlebar">
          <div className="y2k-dot" style={{ background: "#ff7070" }} />
          <div className="y2k-dot" style={{ background: "#ffcc4d" }} />
          <div className="y2k-dot" style={{ background: "#73e06e" }} />
          <span className="ml-1 flex-1 truncate text-xs font-bold text-white">
            {gift.emoji} {gift.name}
          </span>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-0.5 text-[10px] font-bold text-white/80 transition-colors hover:bg-white/20"
          >
            ✕
          </button>
        </div>

        {/* Progress section */}
        <div className="flex items-center gap-3 border-b-2 border-[var(--color-y2k-blue)]/10 bg-white/60 px-4 py-3">
          <div className="flex-1">
            <div className="flex justify-between text-[11px]">
              <span className="font-bold text-[var(--color-y2k-blue)]">
                ⭐ {percent}% 달성
              </span>
              <span className="font-extrabold text-[var(--color-foreground)]">
                {formatWon(gift.currentAmount)} / {formatWon(gift.price)}
              </span>
            </div>
            <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full border border-[var(--color-y2k-blue)]/20 bg-white">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-y2k-blue)] to-[var(--color-y2k-cyan)] transition-all duration-500"
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b-2 border-[var(--color-y2k-blue)]/10 bg-white/40 px-4 py-2">
          <button
            onClick={() => setTab("messages")}
            className={`rounded-full border-2 px-4 py-1.5 text-xs font-bold transition-all ${
              tab === "messages"
                ? "border-[var(--color-y2k-blue)] bg-[var(--color-y2k-blue)] text-white shadow-sm"
                : "border-[var(--color-y2k-blue)]/30 bg-white text-[var(--color-y2k-blue)]"
            }`}
          >
            💬 메시지 ({gift.messages.length})
          </button>
          <button
            onClick={() => setTab("fund")}
            className={`rounded-full border-2 px-4 py-1.5 text-xs font-bold transition-all ${
              tab === "fund"
                ? "border-[var(--color-y2k-pink-dark)] bg-[var(--color-y2k-pink)] text-[#6e1040] shadow-sm"
                : "border-[var(--color-y2k-pink)]/30 bg-white text-[var(--color-y2k-pink-dark)]"
            }`}
          >
            💝 참여하기
          </button>
        </div>

        {/* Content */}
        <div className="flex min-h-0 flex-1 flex-col bg-[var(--color-y2k-window-bg)] px-4 pb-4">
          {tab === "messages" ? (
            <FloatingMessages messages={gift.messages} />
          ) : isComplete ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <span className="text-5xl">🎉</span>
              <p className="text-lg font-extrabold text-[var(--color-y2k-blue-dark)]">
                목표 금액 달성!
              </p>
              <p className="text-sm text-[var(--color-y2k-blue)]">
                모두의 마음이 모였어요!
              </p>
            </div>
          ) : showSuccess ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <span className="text-5xl">💝</span>
              <p className="text-lg font-extrabold text-[var(--color-y2k-pink-dark)]">
                마음 전달 완료!
              </p>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setTab("messages");
                }}
                className="y2k-btn mt-2"
              >
                ⭐ 메시지 보기
              </button>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-3 pt-4">
              {/* Message input */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[var(--color-y2k-blue-dark)]">
                  💌 한마디 남기기
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="축하 메시지, 응원의 한마디를 남겨보세요!"
                  maxLength={100}
                  rows={2}
                  className="y2k-input resize-none text-sm"
                />
                <p className="text-right text-[10px] text-[var(--color-foreground)]/30">
                  {messageText.length}/100
                </p>
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickAmount(amount)}
                    disabled={amount > remaining}
                    className="flex-1 rounded-xl border-2 border-[var(--color-y2k-blue)]/30 bg-white py-2.5 text-sm font-bold text-[var(--color-y2k-blue)] transition-all hover:border-[var(--color-y2k-blue)] hover:bg-[var(--color-y2k-blue)]/5 disabled:opacity-30"
                  >
                    {formatWon(amount)}
                  </button>
                ))}
              </div>

              {/* Amount input */}
              <div className="flex flex-col gap-1">
                <div className="flex overflow-hidden rounded-xl border-2.5 border-[var(--color-y2k-blue)] bg-white">
                  <span className="flex items-center bg-[var(--color-y2k-blue)]/10 px-3 text-sm font-bold text-[var(--color-y2k-blue)]">
                    {"₩"}
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
                {error && (
                  <p className="text-xs font-medium text-[#e04060]">{error}</p>
                )}
                <p className="text-xs text-[var(--color-foreground)]/40">
                  남은 금액: {formatWon(remaining)}
                </p>
              </div>

              {/* Submit */}
              <button onClick={handleSubmit} className="y2k-btn-pink y2k-btn w-full text-center">
                💌 마음 보내기
              </button>

              <div className="rounded-xl border-2 border-dashed border-[var(--color-y2k-yellow)] bg-[var(--color-y2k-yellow)]/30 px-3 py-2 text-center text-[11px] text-[#8a7020]">
                ⚡ 모의 체험입니다. 실제 결제는 진행되지 않아요.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
