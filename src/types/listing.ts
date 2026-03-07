export enum Platform {
  GOTRENDIER = "GOTRENDIER",
  GLOSET = "GLOSET",
  PORTELO = "PORTELO",
}

export enum ListingStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
}

export interface CommentMock {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: "MXN" | "USD";
  size: string;
  category: string;
  brand: string;
  condition: string;
  platform: Platform;
  platformUrl: string;
  images: string[];
  status: ListingStatus;
  likesCount: number;
  comments: CommentMock[];
  createdAt: string;
}

export interface SellerProfile {
  name: string;
  username: string;
  avatarUrl: string;
  rating: number;
  totalSales: number;
  followers: number;
  following: number;
  platforms: Platform[];
}

export type PriceSortOrder = "NONE" | "ASC" | "DESC";

export interface ListingFilters {
  platform: Platform | "ALL";
  category: string;
  status: ListingStatus | "ALL";
  sortByPrice: PriceSortOrder;
}

export interface EngagementState {
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  comments: Record<string, CommentMock[]>;
}
