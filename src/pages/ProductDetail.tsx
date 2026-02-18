import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/constants";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLocale } from "@/contexts/LocaleContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingCart, Star, Minus, Plus, Shield, Truck, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { supabase } from "@/integrations/supabase/client";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const { formatPrice, t } = useLocale();
  const [qty, setQty] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch product from database
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      // Fetch main product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .single();
      
      if (productError) {
        console.error('Error fetching product:', productError);
        setError('Product not found');
        setLoading(false);
        return;
      }
      
      setProduct(productData);
      
      // Fetch related products from same category
      if (productData) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('products')
          .select('*')
          .eq('active', true)
          .eq('category_id', productData.category_id)
          .neq('id', id)
          .limit(4);
          
        if (relatedError) {
          console.error('Error fetching related products:', relatedError);
        } else {
          setRelated(relatedData || []);
        }
      }
      
      setLoading(false);
    };

    fetchProduct();

    // Set up real-time subscription for this product
    const subscription = supabase
      .channel('products-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Product change:', payload);
          fetchProduct(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [id]);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-24 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading product...</p>
        </div>
      </Layout>
    );
  }

  if (!product || error) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link to="/shop" className="text-primary hover:underline font-medium">Browse all products</Link>
        </div>
      </Layout>
    );
  }

  const category = CATEGORIES.find(c => c.id === product.category_id);
  const inWishlist = hasItem(product.id);
  const isOnSale = product.compare_price && product.compare_price > product.price;

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
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
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
              <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
              {isOnSale && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.comparePrice!)}</span>
                  <span className="bg-orange-accent text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    -{Math.round((1 - product.price / product.comparePrice!) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className={`text-sm font-semibold ${product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
              {product.stock > 0 ? `✓ ${t("inStock")} (${product.stock} units)` : `✗ ${t("outOfStock")}`}
            </p>

            <p className="text-muted-foreground leading-relaxed">{product.shortDescription}</p>

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
            {product.longDescription}
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
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
