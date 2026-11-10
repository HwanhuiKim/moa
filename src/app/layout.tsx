import type { Metadata } from "next";
import { GiftProvider } from "@/lib/gift-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "모아 (moa) - 마음을 모아 선물하기",
  description: "친구들과 함께 마음을 모아 원하는 선물을 만들어 보세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <GiftProvider>{children}</GiftProvider>
      </body>
    </html>
  );
}
