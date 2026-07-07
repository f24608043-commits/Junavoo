import Layout from "@/components/Layout";
import { useWishlist } from "@/contexts/WishlistContext";
import { useProducts } from "@/hooks/use-products";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { useMemo } from "react";

export default function Wishlist() {
  const { items } = useWishlist();
  const { products: dbProducts } = useProducts();

  const products = useMemo(() => dbProducts.filter(p => items.includes(p.id)), [dbProducts, items]);

  const mapProduct = (p: typeof dbProducts[0]) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    price_eur: p.price_eur,
    comparePrice: p.compare_price ?? undefined,
    sku: p.sku,
    rating: p.rating,
    stock: p.stock,
    image: p.image || "/placeholder.svg",
    hover_image: p.hover_image,
    shortDescription: p.short_description || "",
    categoryId: p.category_id || "",
    featured: p.featured,
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Wishlist</h1>
        {products.length === 0 ? (
          <div className="text-center py-12"><p className="text-muted-foreground mb-2">Your wishlist is empty.</p><Link to="/shop" className="text-primary hover:underline text-sm">Browse products</Link></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={mapProduct(p)} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
