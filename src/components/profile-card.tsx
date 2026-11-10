"use client";

import { profile } from "@/lib/data";

export default function ProfileCard() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-pink-100 bg-pink-50 text-4xl">
        🧑
      </div>
      <h2 className="text-lg font-bold text-gray-800">{profile.name}</h2>
      <p className="text-center text-sm text-gray-500">{profile.message}</p>
    </div>
  );
}
