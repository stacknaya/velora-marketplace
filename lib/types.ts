export type AssetCategory = "CAR" | "BOAT" | "YACHT" | "RV" | "AIRCRAFT";

export type Listing = {
  id: string;
  slug: string;
  title: string;
  category: AssetCategory;
  city: string;
  state: string;
  price: number;
  priceUnit: string;
  rating: number;
  reviewCount: number;
  instantBook: boolean;
  image: string;
};
