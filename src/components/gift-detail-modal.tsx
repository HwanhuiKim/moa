"use client";

import { useState, useRef, useEffect } from "react";
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

function getHostname(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

const AVATARS = ["🐰", "🐱", "🐶", "🦊", "🐻", "🐼", "🐸", "🐵"];
const HEART_POSITIONS = [
  { top: "10%", left: "5%", delay: 0, size: 14 },
  { top: "25%", right: "8%", delay: 1.2, size: 18 },
  { top: "50%", left: "2%", delay: 0.6, size: 12 },
  { top: "70%", right: "4%", delay: 1.8, size: 16 },
];

const QUICK_AMOUNTS = [5000, 10000, 25000];

function ChatBubble({ msg, index }: { msg: FundMessage; index: number }) {
  const avatar = AVATARS[index % AVATARS.length];

  return (
    <div
      className="flex items-start gap-2 animate-[fadeUp_0.35s_ease-out]"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#ffecd2] to-[#fcb69f] text-base shadow-sm">
        {avatar}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] font-bold text-[var(--color-foreground)]">
            {msg.nickname}
          </span>
          <span className="text-[10px] text-[var(--color-foreground)]/30">
            {timeAgo(msg.createdAt)}
          </span>
        </div>
        <div className="relative w-fit max-w-[85%]">
          <div className="chat-bubble rounded-2xl rounded-tl-sm bg-[#c8e6a0] px-3.5 py-2.5 shadow-sm">
            <p className="text-[13px] leading-relaxed text-[#2a4020]">
              {msg.text}
            </p>
          </div>
          {index % 3 === 0 && (
            <span className="absolute -right-3 -bottom-1 float-animation text-sm">
              💕
            </span>
          )}
        </div>
        <span className="text-[10px] font-semibold text-[var(--color-y2k-pink-dark)]">
          {formatWon(msg.amount)}
        </span>
      </div>
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const remaining = gift.price - gift.currentAmount;
  const percent = Math.round((gift.currentAmount / gift.price) * 100);
  const isComplete = gift.currentAmount >= gift.price;

  useEffect(() => {
    if (showSuccess && scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showSuccess]);

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
        className="flex h-[90vh] w-full max-w-md flex-col overflow-hidden bg-[#f0f6ff] sm:h-[85vh]"
        style={{ borderRadius: "16px 16px 0 0" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-[var(--color-y2k-blue)]/20 bg-[#f0f6ff] px-4 py-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1 text-sm font-bold text-[var(--color-y2k-blue)]"
          >
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path d="M9 1L2 8L9 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-base font-extrabold text-[var(--color-foreground)]">
              {gift.emoji} {gift.name}
            </span>
          </div>
          <div className="w-5" />
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="chat-bg relative flex-1 overflow-y-auto"
        >
          {HEART_POSITIONS.map((h, i) => (
            <span
              key={i}
              className="pointer-events-none absolute float-animation text-pink-300/40"
              style={{
                top: h.top,
                left: h.left,
                right: h.right,
                fontSize: h.size,
                animationDelay: `${h.delay}s`,
              }}
            >
              {"💗"}
            </span>
          ))}

          <div className="relative z-10 flex flex-col gap-5 px-4 py-5">
            {/* Gift info */}
            <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-y2k-cyan)]/30 to-[var(--color-y2k-purple)]/20 text-4xl">
                {gift.emoji}
              </div>
              <p className="text-center text-xs leading-relaxed text-[var(--color-foreground)]/60">
                {gift.description}
              </p>

              {/* Product link */}
              {gift.productUrl && (
                <a
                  href={gift.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border-2 border-[var(--color-y2k-blue)]/25 bg-[var(--color-y2k-blue)]/5 px-3 py-1.5 text-xs font-bold text-[var(--color-y2k-blue)] transition-colors hover:bg-[var(--color-y2k-blue)]/15"
                >
                  <span>{"🔗"}</span>
                  <span>{getHostname(gift.productUrl)}</span>
                  <span className="text-[var(--color-y2k-blue)]/50">{"→"}</span>
                </a>
              )}

              <div className="w-full">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold text-[var(--color-y2k-blue)]">
                    {"⭐"} {percent}% 달성
                  </span>
                  <span className="font-extrabold text-[var(--color-foreground)]">
                    {formatWon(gift.currentAmount)} / {formatWon(gift.price)}
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full border border-[var(--color-y2k-blue)]/20 bg-white">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-y2k-blue)] to-[var(--color-y2k-cyan)] transition-all duration-500"
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-[var(--color-y2k-blue)]/15" />
              <span className="text-[11px] font-bold text-[var(--color-y2k-blue)]/50">
                {"💬"} 응원 메시지 {gift.messages.length}개
              </span>
              <div className="h-px flex-1 bg-[var(--color-y2k-blue)]/15" />
            </div>

            {gift.messages.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6">
                <span className="text-3xl">{"💌"}</span>
                <p className="text-sm text-[var(--color-foreground)]/30">
                  아직 메시지가 없어요. 첫 번째 마음을 보내보세요!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {gift.messages.map((msg, i) => (
                  <ChatBubble key={msg.id} msg={msg} index={i} />
                ))}
              </div>
            )}

            {/* Send message + fund */}
            {showSuccess ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-white/60 bg-white/70 py-8 shadow-sm backdrop-blur-sm">
                <span className="text-5xl">{"💝"}</span>
                <p className="text-lg font-extrabold text-[var(--color-y2k-pink-dark)]">
                  마음 전달 완료!
                </p>
                <p className="text-sm text-[var(--color-foreground)]/50">
                  메시지가 등록되었어요
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="y2k-btn mt-1"
                >
                  {"⭐"} 확인
                </button>
              </div>
            ) : isComplete ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-white/60 bg-white/70 py-8 shadow-sm">
                <span className="text-5xl">{"🎉"}</span>
                <p className="text-lg font-extrabold text-[var(--color-y2k-blue-dark)]">
                  목표 금액 달성!
                </p>
                <p className="text-sm text-[var(--color-y2k-blue)]">
                  모두의 마음이 모였어요!
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-[var(--color-y2k-pink)]/20" />
                  <span className="text-[11px] font-bold text-[var(--color-y2k-pink-dark)]/50">
                    {"💌"} 한마디 남기기
                  </span>
                  <div className="h-px flex-1 bg-[var(--color-y2k-pink)]/20" />
                </div>

                <div className="flex flex-col gap-3 rounded-2xl border-2 border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="축하 메시지, 응원의 한마디를 남겨보세요!"
                    maxLength={100}
                    rows={2}
                    className="y2k-input resize-none text-sm"
                  />
                  <p className="text-right text-[10px] text-[var(--color-foreground)]/25">
                    {messageText.length}/100
                  </p>

                  <div className="flex gap-2">
                    {QUICK_AMOUNTS.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => handleQuickAmount(amount)}
                        disabled={amount > remaining}
                        className="flex-1 rounded-xl border-2 border-[var(--color-y2k-blue)]/25 bg-white py-2 text-xs font-bold text-[var(--color-y2k-blue)] transition-all hover:border-[var(--color-y2k-blue)] disabled:opacity-30"
                      >
                        {formatWon(amount)}
                      </button>
                    ))}
                  </div>

                  <div className="flex overflow-hidden rounded-xl border-2 border-[var(--color-y2k-blue)] bg-white">
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
                      className="w-full px-3 py-2.5 text-sm outline-none"
                      min={0}
                      max={remaining}
                    />
                  </div>
                  {error && (
                    <p className="text-xs font-medium text-[#e04060]">{error}</p>
                  )}
                  <p className="text-[11px] text-[var(--color-foreground)]/35">
                    남은 금액: {formatWon(remaining)}
                  </p>

                  <button
                    onClick={handleSubmit}
                    className="y2k-btn-pink y2k-btn w-full text-center"
                  >
                    {"💌"} 마음 보내기
                  </button>
                </div>

                <div className="rounded-xl border-2 border-dashed border-[var(--color-y2k-yellow)] bg-[var(--color-y2k-yellow)]/30 px-3 py-2 text-center text-[11px] text-[#8a7020]">
                  {"⚡"} 모의 체험입니다. 실제 결제는 진행되지 않아요.
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center gap-2 border-t border-[var(--color-y2k-blue)]/15 bg-[#f0f6ff] px-3 py-2">
          <div className="flex items-center justify-center gap-1 py-1 text-[10px] text-[var(--color-foreground)]/30">
            <span>{"⭐"}</span>
            <span>moa</span>
            <span>{"⭐"}</span>
          </div>
          <div className="flex-1" />
          <span className="text-xs text-[var(--color-foreground)]/25">
            {gift.messages.length}개의 마음
          </span>
        </div>
      </div>
    </div>
  );
}
