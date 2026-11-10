"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Gift } from "./types";
import { initialGifts } from "./data";

interface GiftContextType {
  gifts: Gift[];
  nickname: string;
  setNickname: (name: string) => void;
  hasNickname: boolean;
  fund: (giftId: string, amount: number, message: string) => boolean;
}

const GiftContext = createContext<GiftContextType | null>(null);

export function GiftProvider({ children }: { children: ReactNode }) {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [nickname, setNicknameState] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("moa-nickname");
      if (saved) setNicknameState(saved);
    } catch {}
    setHydrated(true);
  }, []);

  function setNickname(name: string) {
    setNicknameState(name);
    try { localStorage.setItem("moa-nickname", name); } catch {}
  }

  function fund(giftId: string, amount: number, message: string): boolean {
    const gift = gifts.find((g) => g.id === giftId);
    if (!gift) return false;

    const remaining = gift.price - gift.currentAmount;
    if (amount > remaining) return false;

    setGifts((prev) =>
      prev.map((g) =>
        g.id === giftId
          ? {
              ...g,
              currentAmount: g.currentAmount + amount,
              messages: [
                ...g.messages,
                {
                  id: `msg-${Date.now()}`,
                  nickname: nickname || "익명",
                  text: message || "마음을 보냅니다 💕",
                  amount,
                  createdAt: Date.now(),
                },
              ],
            }
          : g,
      ),
    );
    return true;
  }

  return (
    <GiftContext.Provider
      value={{ gifts, nickname, setNickname, hasNickname: hydrated && nickname.length > 0, fund }}
    >
      {children}
    </GiftContext.Provider>
  );
}

export function useGifts() {
  const context = useContext(GiftContext);
  if (!context) throw new Error("useGifts must be used within GiftProvider");
  return context;
}
