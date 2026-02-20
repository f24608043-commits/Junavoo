import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/contexts/LocaleContext";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero3D from "@/components/ui/hero-3d";

gsap.registerPlugin(ScrollTrigger);

const TRUST_BADGES = [
  { icon: Truck, label: "Free Shipping", sub: "On orders over $50" },
  { icon: Shield, label: "Secure Payment", sub: "100% protected" },
  { icon: RefreshCw, label: "Easy Returns", sub: "30-day guarantee" },
  { icon: Headphones, label: "24/7 Support", sub: "Always here to help" },
];

export default function Index() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { t, formatPrice, language } = useLocale();
  const { products } = useProducts();
  const { categories } = useCategories();

  const featuredProducts = useMemo(() => products.filter(p => p.featured).slice(0, 4), [products]);
  const bestSellers = useMemo(() => [...products].sort((a, b) => b.rating - a.rating).slice(0, 4), [products]);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const bestRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  // GSAP scroll reveals - Temporarily simplified to fix runtime issues
  useEffect(() => {
    // Reveal logic disabled for stability during redesign
    return () => { };
  }, [categories.length, featuredProducts.length, bestSellers.length]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      await supabase.from("subscribers").insert({ email: email.trim() });
      setSubscribed(true);
      setEmail("");
    }
  };

  const mapProduct = (p: typeof products[0]) => ({
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
      <Hero3D />

      {/* Trust badges */}
      <section className="relative z-20 -mt-10 md:-mt-16 px-6">
        <div ref={trustRef} className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
            {TRUST_BADGES.map((b, i) => (
              <div key={i} className="trust-item bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl p-8 flex flex-col items-center text-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors duration-300">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                  <b.icon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900 dark:text-white mb-1">{b.label}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-24 md:py-40">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{t("shopByCategory")}</h2>
              <div className="h-1.5 w-16 bg-blue-600 rounded-full" />
            </div>
            <div ref={categoriesRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {categories.map(cat => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="cat-card group">
                  <div className="rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 flex flex-col items-center justify-center text-center min-h-[140px] hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group-hover:-translate-y-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-24 md:py-40 bg-slate-50/50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{t("featuredProducts")}</h2>
              <div className="h-1.5 w-16 bg-blue-600 rounded-full" />
              <Link to="/shop" className="mt-6 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 group">
                {t("viewAll")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div ref={featuredRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {featuredProducts.map(p => (
                <div key={p.id} className="product-reveal">
                  <ProductCard product={mapProduct(p)} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-6 py-12 text-center max-w-7xl">
          <p className="text-xl md:text-2xl font-black tracking-tight uppercase">🚚 {t("freeShipping")} {formatPrice(50)}</p>
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-24 md:py-40">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col items-center text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{t("bestSellers")}</h2>
              <div className="h-1.5 w-16 bg-blue-600 rounded-full" />
              <Link to="/shop" className="mt-6 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 group">
                {t("viewAll")} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div ref={bestRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {bestSellers.map(p => (
                <div key={p.id} className="product-reveal">
                  <ProductCard product={mapProduct(p)} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-6 py-16 text-center max-w-xl">
          <h2 className="text-3xl font-bold mb-3">{t("stayUpdated")}</h2>
          <p className="mb-8 opacity-80">{t("subscribeDesc")}</p>
          {subscribed ? (
            <p className="font-semibold text-lg">✓ {t("thankYou")}</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm mx-auto">
              <Input
                placeholder={t("yourEmail")}
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 rounded-xl"
              />
              <Button type="submit" variant="secondary" className="rounded-xl shrink-0">{t("subscribe")}</Button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
