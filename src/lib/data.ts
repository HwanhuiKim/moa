import { Gift, Profile } from "./types";

export const profile: Profile = {
  name: "김하늘",
  avatarUrl: "",
  message: "제 위시리스트에 오신 걸 환영해요! 마음을 모아 선물해 주세요 🎁",
};

export const initialGifts: Gift[] = [
  {
    id: "gift-1",
    name: "에어팟 프로 2",
    price: 359000,
    imageUrl: "",
    emoji: "🎧",
    bgColor: "bg-pink-50",
    description:
      "매일 음악을 들으며 출퇴근하는데, 노이즈 캔슬링이 되는 이어폰을 갖고 싶어요.",
    currentAmount: 120000,
  },
  {
    id: "gift-2",
    name: "다이슨 에어랩",
    price: 690000,
    imageUrl: "",
    emoji: "💇‍♀️",
    bgColor: "bg-blue-50",
    description:
      "매일 아침 머리 하는 시간을 줄이고 싶어요. 다이슨 에어랩이면 완벽할 것 같아요!",
    currentAmount: 250000,
  },
  {
    id: "gift-3",
    name: "스탠리 텀블러 세트",
    price: 89000,
    imageUrl: "",
    emoji: "🥤",
    bgColor: "bg-green-50",
    description:
      "요즘 텀블러 들고 다니는 게 유행이래요. 예쁜 스탠리 텀블러를 갖고 싶어요!",
    currentAmount: 30000,
  },
];
