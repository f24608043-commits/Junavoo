import Layout from "@/components/Layout";
import { useWishlist } from "@/contexts/WishlistContext";
import { DEMO_PRODUCTS } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { items } = useWishlist();
  const products = DEMO_PRODUCTS.filter(p => items.includes(p.id));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Wishlist</h1>
        {products.length === 0 ? (
          <div className="text-center py-12"><p className="text-muted-foreground mb-2">Your wishlist is empty.</p><Link to="/shop" className="text-primary hover:underline text-sm">Browse products</Link></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
