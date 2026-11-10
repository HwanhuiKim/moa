"use client";

import { useGifts } from "@/lib/gift-context";
import Y2kWindow from "./y2k-window";

export default function ProfileCard() {
  const { profile } = useGifts();

  return (
    <Y2kWindow title={`${profile.name}'s Wishlist`} icon="💫">
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="float-animation relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-[var(--color-y2k-blue)] bg-gradient-to-br from-[var(--color-y2k-cyan)] to-[var(--color-y2k-purple)] text-4xl shadow-md">
            {profile.emoji}
          </div>
          <span className="absolute -right-1 -bottom-1 text-lg">{"✨"}</span>
        </div>
        <h2 className="text-lg font-extrabold text-[var(--color-y2k-blue-dark)]">
          {profile.name}
        </h2>
        <div className="rounded-xl border-2 border-dashed border-[var(--color-y2k-blue)] bg-white/60 px-4 py-2">
          <p className="text-center text-sm text-[var(--color-foreground)]">
            {profile.message}
          </p>
        </div>
      </div>
    </Y2kWindow>
  );
}
