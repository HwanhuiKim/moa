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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-xl"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-5xl">
          👋
        </div>
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-bold text-gray-800">환영합니다!</h2>
          <p className="text-center text-sm text-gray-500">
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
          className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-center text-sm outline-none transition-colors focus:border-pink-300"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-pink-400 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-200 transition-all disabled:opacity-40"
        >
          시작하기
        </button>
      </form>
    </div>
  );
}
