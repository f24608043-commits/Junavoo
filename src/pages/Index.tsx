import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/constants";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/contexts/LocaleContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, formatPrice, language } = useLocale();

  const heroRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const bestRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      // Fetch featured products
      const { data: featured, error: featuredError } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(4);
      
      // Fetch best sellers (highest rated)
      const { data: best, error: bestError } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('rating', { ascending: false })
        .limit(4);
      
      if (featuredError) console.error('Error fetching featured products:', featuredError);
      if (bestError) console.error('Error fetching best sellers:', bestError);
      
      setFeaturedProducts(featured || []);
      setBestSellers(best || []);
      setLoading(false);
    };

    fetchProducts();

    // Set up real-time subscription
    const subscription = supabase
      .channel('products-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Product change:', payload);
          fetchProducts(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // GSAP hero entrance
  useEffect(() => {
    if (!heroRef.current) return;
    const tl = gsap.timeline({ delay: 0.1 });
    tl.fromTo(".hero-badge", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .fromTo(".hero-title", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "-=0.3")
      .fromTo(".hero-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.5")
      .fromTo(".hero-cta", { opacity: 0, y: 16, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.5)" }, "-=0.4")
      .fromTo(".hero-image", { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }, "-=0.8");
    return () => { tl.kill(); };
  }, []);

  // GSAP scroll reveals
  useEffect(() => {
    const reveals = [
      { ref: categoriesRef, selector: ".cat-card" },
      { ref: featuredRef, selector: ".product-reveal" },
      { ref: bestRef, selector: ".product-reveal" },
      { ref: trustRef, selector: ".trust-item" },
    ];
    reveals.forEach(({ ref, selector }) => {
      if (!ref.current) return;
      gsap.fromTo(ref.current.querySelectorAll(selector),
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
        }
      );
    });
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      await supabase.from("subscribers").insert({ email: email.trim() });
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-muted/60 via-background to-background border-b">
        <div className="container mx-auto px-6 py-20 md:py-32 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="hero-badge inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest bg-muted text-primary border border-border px-4 py-1.5 rounded-full mb-6">
                ✦ {language === "it" ? "Benvenuti su Junavo" : "Welcome to Junavo"}
              </div>
              <h1 className="hero-title text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                {language === "it"
                  ? <>Tutto Ciò di Cui Hai Bisogno. <span className="orange-accent">Un Posto.</span></>
                  : <>Everything You Need. <span className="orange-accent">One Place.</span></>
                }
              </h1>
              <p className="hero-sub text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
                {language === "it"
                  ? "Prodotti di qualità in 12 categorie, consegnati alla tua porta."
                  : "Quality products across 12 categories, delivered to your door."}
              </p>
              <div className="hero-cta flex items-center gap-3">
                <Button asChild size="lg" className="rounded-xl font-semibold gap-2 px-8">
                  <Link to="/shop">{t("shopNow")} <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl font-medium">
                  <Link to="/blog">{t("blog")}</Link>
                </Button>
              </div>
            </div>
            <div className="hero-image relative hidden md:block">
              <div className="aspect-square max-w-md ml-auto rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border">
                <div className="text-center p-8">
                  <div className="text-8xl mb-4">🛍️</div>
                  <p className="text-muted-foreground font-medium">{t("language") === "Lingua" ? "Il tuo marketplace premium" : "Your premium marketplace"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-b bg-card">
        <div ref={trustRef} className="container mx-auto px-6 py-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_BADGES.map((b, i) => (
              <div key={i} className="trust-item flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{b.label}</p>
                  <p className="text-xs text-muted-foreground">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-py">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t("shopByCategory")}</h2>
          </div>
          <div ref={categoriesRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATEGORIES.map(cat => (
              <Link key={cat.id} to={`/category/${cat.slug}`} className="cat-card group">
                <div className="rounded-2xl border bg-card p-4 flex flex-col items-center justify-center text-center min-h-[80px] hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:shadow-md">
                  <cat.icon className="h-6 w-6 mb-2 text-current" />
                  <span className="text-sm font-medium leading-tight">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-py bg-muted/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t("featuredProducts")}</h2>
            <Link to="/shop" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">{t("viewAll")} <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div ref={featuredRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map(p => (
              <div key={p.id} className="product-reveal">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 py-8 text-center max-w-7xl">
          <p className="text-lg font-bold">🚚 {t("freeShipping")} {formatPrice(50)}</p>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-py">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t("bestSellers")}</h2>
            <Link to="/shop" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">{t("viewAll")} <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div ref={bestRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.map(p => (
              <div key={p.id} className="product-reveal">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

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
