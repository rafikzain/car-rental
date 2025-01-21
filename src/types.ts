export interface Car {
  id: number;
  name: string;
  brand: string;
  type: "rent" | "sale";
  price: number;
  image?: string; // Made optional since it's not in DB
  description: string;
  specs?: { // Made optional since it's not in DB
    engine: string;
    power: string;
    acceleration: string;
    transmission: string;
  };
  userId?: string;
  location?: string;
  phoneNumber?: string;
  images?: string[];
  featured?: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  userType: "buyer" | "seller" | "both" | "admin";
  phoneNumber?: string;
  location?: string;
  isBanned?: boolean;
  isScammer?: boolean;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  sellerId: string;
  rating: number;
  comment: string;
  carId: number;
  transactionType: "buy" | "rent";
  createdAt: Date;
}