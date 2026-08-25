import { Listing } from "./types";

export const listings: Listing[] = [
  {
    id: "1",
    slug: "lamborghini-huracan-evo-dallas",
    title: "Lamborghini Huracán EVO",
    category: "CAR",
    city: "Dallas",
    state: "TX",
    price: 1295,
    priceUnit: "day",
    rating: 4.98,
    reviewCount: 61,
    instantBook: true,
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1400&q=85"
  },
  {
    id: "2",
    slug: "sunseeker-74-miami",
    title: "Sunseeker 74 Yacht",
    category: "YACHT",
    city: "Miami",
    state: "FL",
    price: 4900,
    priceUnit: "day",
    rating: 4.96,
    reviewCount: 34,
    instantBook: false,
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=85"
  },
  {
    id: "3",
    slug: "airstream-interstate-austin",
    title: "Airstream Interstate 24X",
    category: "RV",
    city: "Austin",
    state: "TX",
    price: 425,
    priceUnit: "day",
    rating: 4.92,
    reviewCount: 27,
    instantBook: true,
    image: "https://images.unsplash.com/photo-1532939624-3af1308db9a5?auto=format&fit=crop&w=1400&q=85"
  }
];
