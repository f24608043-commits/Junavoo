import { Home, Laptop, Gamepad2, Wrench, BedDouble, Dumbbell, Sparkles, Shirt, Trees } from "lucide-react";

export const CATEGORIES = [
  { id: "home-kitchen", name: "Home & Kitchen", slug: "home-kitchen", icon: Home },
  { id: "electronics-tech", name: "Electronics & Tech", slug: "electronics-tech", icon: Laptop },
  { id: "toys", name: "Toys", slug: "toys", icon: Gamepad2 },
  { id: "tools", name: "Tools", slug: "tools", icon: Wrench },
  { id: "beddings", name: "Beddings", slug: "beddings", icon: BedDouble },
  { id: "gym-sports", name: "Gym & Sports", slug: "gym-sports", icon: Dumbbell },
  { id: "cosmetics", name: "Cosmetics", slug: "cosmetics", icon: Sparkles },
  { id: "clothing", name: "Clothing", slug: "clothing", icon: Shirt },
  { id: "garden-outdoor", name: "Garden & Outdoor", slug: "garden-outdoor", icon: Trees },
] as const;

export type Product = {
  id: string;
  name: string;
  price: number;         // USD price
  comparePrice?: number; // USD original price (for discount)
  sku: string;
  rating: number;
  stock: number;
  shortDescription: string;
  longDescription: string;
  image: string;
  categoryId: string;
  featured: boolean;
};
