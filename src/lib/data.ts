import { Gift, Profile } from "./types";

export const defaultProfile: Profile = {
  name: "김하늘",
  emoji: "🧑",
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
    productUrl: "https://www.coupang.com/vp/products/7335597976",
    currentAmount: 120000,
    messages: [
      { id: "msg-1", nickname: "익명의 토끼", text: "생일 축하해! 🎂", amount: 50000, createdAt: Date.now() - 86400000 },
      { id: "msg-2", nickname: "하늘사랑", text: "좋은 이어폰으로 좋은 음악 들어~", amount: 30000, createdAt: Date.now() - 43200000 },
      { id: "msg-3", nickname: "음악요정", text: "노캔은 인생이 달라진다 ㅋㅋ", amount: 40000, createdAt: Date.now() - 3600000 },
    ],
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
    productUrl: "https://www.coupang.com/vp/products/6494965854",
    currentAmount: 250000,
    messages: [
      { id: "msg-4", nickname: "뷰티러버", text: "나도 쓰는데 진짜 좋아!!", amount: 100000, createdAt: Date.now() - 172800000 },
      { id: "msg-5", nickname: "머리요정", text: "에어랩 사면 인생이 달라짐 ㅎㅎ", amount: 150000, createdAt: Date.now() - 7200000 },
    ],
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
    productUrl: "https://www.musinsa.com/products/3619883",
    currentAmount: 30000,
    messages: [
      { id: "msg-6", nickname: "텀블러매니아", text: "스탠리 진짜 예쁘지!", amount: 30000, createdAt: Date.now() - 600000 },
    ],
  },
];
