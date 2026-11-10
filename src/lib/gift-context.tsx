"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Gift, Profile, UserRole } from "./types";
import { initialGifts, defaultProfile } from "./data";

interface GiftContextType {
  gifts: Gift[];
  profile: Profile;
  nickname: string;
  setNickname: (name: string) => void;
  hasNickname: boolean;
  role: UserRole;
  fund: (giftId: string, amount: number, message: string) => boolean;
  updateProfile: (p: Profile) => void;
  addGift: (gift: Gift) => void;
  removeGift: (giftId: string) => void;
  myContributions: string[];
}

const GiftContext = createContext<GiftContextType | null>(null);

export function GiftProvider({ children }: { children: ReactNode }) {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [nickname, setNicknameState] = useState("");
  const [role, setRole] = useState<UserRole>("visitor");
  const [myContributions, setMyContributions] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedNick = localStorage.getItem("moa-nickname");
      if (savedNick) setNicknameState(savedNick);

      const savedRole = localStorage.getItem("moa-role") as UserRole | null;
      if (savedRole) setRole(savedRole);

      const savedContribs = localStorage.getItem("moa-contributions");
      if (savedContribs) setMyContributions(JSON.parse(savedContribs));

      const savedProfile = localStorage.getItem("moa-profile");
      if (savedProfile) setProfile(JSON.parse(savedProfile));

      const savedGifts = localStorage.getItem("moa-gifts");
      if (savedGifts) setGifts(JSON.parse(savedGifts));
    } catch {}
    setHydrated(true);
  }, []);

  const persistGifts = useCallback((newGifts: Gift[]) => {
    setGifts(newGifts);
    try { localStorage.setItem("moa-gifts", JSON.stringify(newGifts)); } catch {}
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

    const newGifts = gifts.map((g) =>
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
    );
    persistGifts(newGifts);

    if (role !== "owner") {
      setRole("contributor");
      try { localStorage.setItem("moa-role", "contributor"); } catch {}
    }
    const newContribs = [...new Set([...myContributions, giftId])];
    setMyContributions(newContribs);
    try { localStorage.setItem("moa-contributions", JSON.stringify(newContribs)); } catch {}

    return true;
  }

  function updateProfile(p: Profile) {
    setProfile(p);
    setRole("owner");
    try {
      localStorage.setItem("moa-profile", JSON.stringify(p));
      localStorage.setItem("moa-role", "owner");
    } catch {}
  }

  function addGift(gift: Gift) {
    const newGifts = [...gifts, gift];
    persistGifts(newGifts);
  }

  function removeGift(giftId: string) {
    const newGifts = gifts.filter((g) => g.id !== giftId);
    persistGifts(newGifts);
  }

  return (
    <GiftContext.Provider
      value={{
        gifts,
        profile,
        nickname,
        setNickname,
        hasNickname: hydrated && nickname.length > 0,
        role,
        fund,
        updateProfile,
        addGift,
        removeGift,
        myContributions,
      }}
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
