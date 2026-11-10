"use client";

import { useState } from "react";
import { useGifts } from "@/lib/gift-context";

export default function NicknameModal() {
  const { hasNickname, setNickname } = useGifts();
  const [input, setInput] = useState("");
  const [show, setShow] = useState(true);

  if (hasNickname || !show) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setNickname(trimmed);
    setShow(false);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="y2k-window w-full max-w-sm animate-[fadeUp_0.3s_ease-out]"
      >
        {/* Titlebar */}
        <div className="y2k-titlebar">
          <div className="y2k-dot" style={{ background: "#ff7070" }} />
          <div className="y2k-dot" style={{ background: "#ffcc4d" }} />
          <div className="y2k-dot" style={{ background: "#73e06e" }} />
          <span className="ml-1 text-xs font-bold text-white">
            ✨ Welcome to moa!
          </span>
        </div>

        <div className="flex flex-col items-center gap-5 p-6">
          <div className="float-animation text-6xl">👋</div>

          <div className="flex flex-col items-center gap-1">
            <h2 className="text-xl font-extrabold text-[var(--color-y2k-blue-dark)]">
              환영합니다!
            </h2>
            <p className="text-center text-sm text-[var(--color-foreground)]/70">
              마음을 전할 때 사용할 닉네임을 알려주세요
            </p>
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="닉네임을 입력하세요"
            maxLength={12}
            autoFocus
            className="y2k-input w-full text-center"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="y2k-btn w-full text-center disabled:opacity-40"
          >
            ⭐ 시작하기
          </button>
        </div>
      </form>
    </div>
  );
}
