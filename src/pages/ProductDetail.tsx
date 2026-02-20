import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { useProduct, useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingCart, Star, Minus, Plus, Shield, Truck, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { product, loading } = useProduct(id);
  const { products: allProducts } = useProducts();
  const { categories } = useCategories();
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const { formatPrice, t, currency } = useLocale();
  const [qty, setQty] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && product) {
      gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [id, product]);

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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-24 text-center">
          <div className="animate-pulse h-8 w-48 bg-muted rounded mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-primary hover:underline font-medium">Browse all products</Link>
        </div>
      </Layout>
    );
  }

  const category = categories.find(c => c.id === product.category_id);
  const related = allProducts.filter(p => p.category_id === product.category_id && p.id !== product.id).slice(0, 4);
  const inWishlist = hasItem(product.id);
  const isOnSale = product.compare_price && product.compare_price > product.price;

  const displayPrice = currency === "EUR" && product.price_eur != null
    ? `€${Number(product.price_eur).toFixed(2)}`
    : `$${Number(product.price).toFixed(2)}`;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground">{t("home")}</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground">{t("shop")}</Link>
          {category && <>
            <span>/</span>
            <Link to={`/category/${category.slug}`} className="hover:text-foreground">{category.name}</Link>
          </>}
          <span>/</span>
          <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="aspect-square bg-muted rounded-3xl overflow-hidden border">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
          </div>

          {/* Info */}
          <div ref={contentRef} className="space-y-5 flex flex-col justify-center">
            <div>
              {category && (
                <Link to={`/category/${category.slug}`} className="text-xs font-semibold uppercase tracking-widest text-primary mb-2 block">
                  {category.name}
                </Link>
              )}
              <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                ))}
              </div>
              <span className="text-sm font-semibold">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.stock > 0 ? "In stock" : "Unavailable"})</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">{displayPrice}</span>
              {isOnSale && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compare_price!)}</span>
                  <span className="bg-orange-accent text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    -{Math.round((1 - product.price / product.compare_price!) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className={`text-sm font-semibold ${product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
              {product.stock > 0 ? `✓ ${t("inStock")} (${product.stock} units)` : `✗ ${t("outOfStock")}`}
            </p>

            <p className="text-muted-foreground leading-relaxed">{product.short_description}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold">{t("quantity")}:</span>
              <div className="flex items-center border rounded-xl overflow-hidden">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-3.5 w-3.5" /></Button>
                <span className="w-12 text-center text-sm font-semibold border-x">{qty}</span>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none" onClick={() => setQty(Math.min(product.stock, qty + 1))}><Plus className="h-3.5 w-3.5" /></Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 rounded-xl font-semibold h-12"
                disabled={product.stock === 0}
                onClick={() => addItem(product.id, qty)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> {t("addToCart")}
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-xl font-semibold h-12"
                disabled={product.stock === 0}
                asChild
              >
                <Link to="/checkout" onClick={() => addItem(product.id, qty)}>{t("buyNow")}</Link>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-xl"
                onClick={() => toggleItem(product.id)}
                aria-label="Wishlist"
              >
                <Heart className={`h-5 w-5 ${inWishlist ? "fill-destructive text-destructive" : ""}`} />
              </Button>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t">
              {[
                { icon: Truck, text: "Free shipping over $50" },
                { icon: Shield, text: "Secure payment" },
                { icon: RefreshCw, text: "30-day returns" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex flex-col items-center gap-1 text-center">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-[10px] text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="rounded-2xl">
            <TabsTrigger value="description" className="rounded-xl">{t("description")}</TabsTrigger>
            <TabsTrigger value="specs" className="rounded-xl">{t("specifications")}</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-xl">{t("reviews")}</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="text-muted-foreground pt-6 leading-relaxed">
            {product.long_description || product.short_description}
          </TabsContent>
          <TabsContent value="specs" className="pt-6">
            <div className="rounded-2xl border overflow-hidden">
              {[
                { label: "SKU", value: product.sku },
                { label: "Category", value: category?.name || "-" },
                { label: "Rating", value: `${product.rating}/5` },
                { label: "Stock", value: `${product.stock} units` },
              ].map(({ label, value }, i) => (
                <div key={i} className={`flex gap-4 px-5 py-3 text-sm ${i % 2 === 0 ? "bg-muted/40" : "bg-card"}`}>
                  <span className="font-semibold w-32 shrink-0">{label}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="text-muted-foreground pt-6">
            <div className="rounded-2xl border p-8 text-center">
              <Star className="h-8 w-8 text-muted mx-auto mb-2" />
              <p>No reviews yet. Be the first to review this product.</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">{t("relatedProducts")}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={mapProduct(p)} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
