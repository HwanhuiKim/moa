export interface FundMessage {
  id: string;
  nickname: string;
  text: string;
  amount: number;
  createdAt: number;
}

export interface Gift {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  emoji: string;
  bgColor: string;
  description: string;
  productUrl: string;
  currentAmount: number;
  messages: FundMessage[];
}

export type UserRole = "owner" | "visitor" | "contributor";

export interface Profile {
  name: string;
  emoji: string;
  message: string;
}
