// Product type kept for compatibility with components that need it
export type Product = {
  id: string;
  name: string;
  price: number;
  price_eur?: number | null;
  comparePrice?: number;
  sku: string;
  rating: number;
  stock: number;
  shortDescription?: string;
  longDescription?: string;
  image: string;
  hover_image?: string | null;
  categoryId?: string;
  featured?: boolean;
};
