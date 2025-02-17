export interface Car {
  id: number;
  name: string;
  brand: string;
  dailyRate: number;
  image?: string;
  description: string;
  specs?: {
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
  city: 'Casablanca' | 'FES' | 'RABAT' | 'AGADIR' | 'MARRAKECH';
}

export interface CarAvailability {
  id: number;
  carId: number;
  startDate: Date;
  endDate: Date;
  status: 'booked' | 'maintenance' | 'unavailable';
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  userType: "owner" | "renter" | "both" | "admin";
  phoneNumber?: string;
  location?: string;
  isBanned?: boolean;
  isScammer?: boolean;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  ownerId: string;
  rating: number;
  comment: string;
  carId: number;
  createdAt: Date;
}
