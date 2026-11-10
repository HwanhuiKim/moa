export interface Gift {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  emoji: string;
  bgColor: string;
  description: string;
  currentAmount: number;
}

export interface Profile {
  name: string;
  avatarUrl: string;
  message: string;
}
