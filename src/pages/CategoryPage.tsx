import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { categories } = useCategories();
  const { products: allProducts, loading } = useProducts();

  const category = categories.find(c => c.slug === slug);
  const products = useMemo(
    () => allProducts.filter(p => p.category_id === category?.id),
    [allProducts, category?.id]
  );

  const mapProduct = (p: typeof allProducts[0]) => ({
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

  if (!category && !loading) {
    return <Layout><div className="container mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-semibold mb-2">Category Not Found</h1><Link to="/shop" className="text-primary hover:underline text-sm">Browse all products</Link></div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">{category?.name || "Loading..."}</h1>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border bg-muted animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-muted-foreground">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={mapProduct(p)} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
