"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Gift } from "./types";
import { initialGifts } from "./data";

interface GiftContextType {
  gifts: Gift[];
  fund: (giftId: string, amount: number) => boolean;
}

const GiftContext = createContext<GiftContextType | null>(null);

export function GiftProvider({ children }: { children: ReactNode }) {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);

  function fund(giftId: string, amount: number): boolean {
    const gift = gifts.find((g) => g.id === giftId);
    if (!gift) return false;

    const remaining = gift.price - gift.currentAmount;
    if (amount > remaining) return false;

    setGifts((prev) =>
      prev.map((g) =>
        g.id === giftId
          ? { ...g, currentAmount: g.currentAmount + amount }
          : g,
      ),
    );
    return true;
  }

  return (
    <GiftContext.Provider value={{ gifts, fund }}>
      {children}
    </GiftContext.Provider>
  );
}

export function useGifts() {
  const context = useContext(GiftContext);
  if (!context) throw new Error("useGifts must be used within GiftProvider");
  return context;
}
