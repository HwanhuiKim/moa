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
  currentAmount: number;
  messages: FundMessage[];
}

export interface Profile {
  name: string;
  avatarUrl: string;
  message: string;
}
