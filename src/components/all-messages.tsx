"use client";

import { useGifts } from "@/lib/gift-context";
import { FundMessage } from "@/lib/types";

const AVATARS = ["\u{1F430}", "\u{1F431}", "\u{1F436}", "\u{1F98A}", "\u{1F43B}", "\u{1F43C}", "\u{1F438}", "\u{1F435}"];

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

function formatWon(amount: number) {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

interface MessageWithGift extends FundMessage {
  giftEmoji: string;
  giftName: string;
}

export default function AllMessages() {
  const { gifts } = useGifts();

  const allMessages: MessageWithGift[] = gifts
    .flatMap((g) =>
      g.messages.map((m) => ({
        ...m,
        giftEmoji: g.emoji,
        giftName: g.name,
      }))
    )
    .sort((a, b) => b.createdAt - a.createdAt);

  if (allMessages.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <span className="text-5xl">{"\u{1F4EC}"}</span>
        <p className="text-sm text-[var(--color-foreground)]/40">
          {"아직 메시지가 없어요"}
        </p>
      </div>
    );
  }

  return (
    <div className="chat-bg rounded-2xl border-2 border-[var(--color-y2k-blue)]/20 p-4">
      <div className="flex flex-col gap-3">
        {allMessages.map((msg, i) => {
          const avatar = AVATARS[i % AVATARS.length];
          return (
            <div
              key={msg.id}
              className="flex items-start gap-2.5 animate-[fadeUp_0.3s_ease-out]"
              style={{
                animationDelay: `${i * 40}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Avatar */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#ffecd2] to-[#fcb69f] text-base shadow-sm">
                {avatar}
              </div>
              {/* Bubble */}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] font-bold text-[var(--color-foreground)]">
                    {msg.nickname}
                  </span>
                  <span className="text-[10px] text-[var(--color-foreground)]/30">
                    {timeAgo(msg.createdAt)}
                  </span>
                </div>
                <div className="relative w-fit max-w-[88%]">
                  <div className="rounded-2xl rounded-tl-sm bg-[#c8e6a0] px-3.5 py-2.5 shadow-sm">
                    <p className="text-[13px] leading-relaxed text-[#2a4020]">
                      {msg.text}
                    </p>
                  </div>
                  {i % 4 === 0 && (
                    <span className="absolute -right-3 -bottom-1 float-animation text-sm">
                      {"\u{1F495}"}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">{msg.giftEmoji}</span>
                  <span className="text-[10px] text-[var(--color-foreground)]/35">
                    {msg.giftName}
                  </span>
                  <span className="text-[10px] font-semibold text-[var(--color-y2k-pink-dark)]">
                    {formatWon(msg.amount)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
