import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ProductCard from "@/components/ProductCard";
import CardFlip from "@/components/CardFlip";
import SEO, { generateWebsiteSchema, generateOrganizationSchema, generateFAQSchema } from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, Star, ChevronDown, HelpCircle } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/contexts/LocaleContext";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BackgroundCircles } from "@/components/ui/background-circles";

gsap.registerPlugin(ScrollTrigger);

const TRUST_BADGES = [
  { icon: Truck, label: "Free Shipping", sub: "On orders over $50" },
  { icon: Shield, label: "Secure Payment", sub: "100% protected" },
  { icon: RefreshCw, label: "Easy Returns", sub: "30-day guarantee" },
  { icon: Headphones, label: "24/7 Support", sub: "Always here to help" },
];

// Category banner mapping
const categoryBanners: Record<string, string> = {
  toys: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=400&fit=crop&q=75&auto=format",
  "gym-sports": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop&q=75&auto=format",
  cosmetics: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop&q=75&auto=format",
  "garden-outdoor": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop&q=75&auto=format",
  "home-kitchen": "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=400&fit=crop&q=75&auto=format",
  crockery: "https://images.unsplash.com/photo-1578849675582-8d51ec53e05c?w=800&h=400&fit=crop&q=75&auto=format",
  hardware: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=400&fit=crop&q=75&auto=format",
  tools: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=400&fit=crop&q=75&auto=format",
  "electronics-tech": "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=400&fit=crop&q=75&auto=format",
  electronics: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop&q=75&auto=format",
  beddings: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&h=400&fit=crop&q=75&auto=format",
  linean: "https://images.unsplash.com/photo-1505693416388-acece34c2c8e?w=800&h=400&fit=crop&q=75&auto=format",
  clothing: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop&q=75&auto=format",
  kapre: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop&q=75&auto=format",
};

export default function Index() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { t, formatPrice, language } = useLocale();
  const { products } = useProducts();
  const { categories } = useCategories();

  const featuredProducts = useMemo(() => products.filter(p => p.featured).slice(0, 4), [products]);
  const bestSellers = useMemo(() => [...products].sort((a, b) => b.rating - a.rating).slice(0, 4), [products]);
  const trendingProducts = useMemo(() => [...products].filter(p => p.created_at || p.featured).slice(0, 8), [products]);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const bestRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  const faqs = [
    { 
      question: "How do I place an order?", 
      answer: "Browse our products, add items to your cart, and proceed to checkout. Fill in your shipping details and complete the payment. You'll receive an order confirmation email with tracking information."
    },
    { 
      question: "What payment methods do you accept?", 
      answer: "We currently accept Cash on Delivery (COD) for your convenience. We're working on adding card payment options and digital wallets soon."
    },
    { 
      question: "How long does shipping take?", 
      answer: "Standard shipping takes 3-7 business days depending on your location within the EU. Express shipping options are available for faster delivery."
    },
    { 
      question: "Is there free shipping?", 
      answer: "Yes! Orders over $50 qualify for free standard shipping. For orders under $50, a small shipping fee of $5.99 applies."
    },
    { 
      question: "What is your return policy?", 
      answer: "We offer a 30-day easy return policy on all products. If you're not satisfied, contact our support team within 30 days of delivery to initiate a return."
    },
    { 
      question: "How can I track my order?", 
      answer: "Once your order is shipped, you'll receive a tracking number via email. You can also log into your account and check the Orders section for real-time status updates."
    },
    { 
      question: "Are your products authentic?", 
      answer: "Absolutely! All our products are 100% authentic and sourced directly from verified suppliers and manufacturers. We guarantee quality and authenticity."
    },
    { 
      question: "Do you ship internationally?", 
      answer: "Currently, we ship to all EU countries. We're working on expanding our shipping to other regions. Stay tuned for updates on international shipping."
    },
    { 
      question: "How do I contact customer support?", 
      answer: "You can reach our customer support team 24/7 via email at support@junavoo.com or through the contact form on our website. We typically respond within 24 hours."
    },
    { 
      question: "Can I cancel my order?", 
      answer: "Yes, you can cancel your order within 24 hours of placing it. After that, please contact our support team and we'll do our best to accommodate your request."
    },
  ];

  useEffect(() => {
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
      <SEO 
        title="Home"
        description="Discover amazing deals on premium products. Shop Toys, Home & Kitchen, Gym & Sports, Cosmetics, Garden & Outdoor, Tools, Electronics, Beddings, and Clothing."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }} />
      
      <BackgroundCircles 
        title="Junavo"
        description={language === "it" ? "Tutto ciò di cui hai bisogno. Un posto." : "Everything you need. One place."}
        variant="primary"
      />
      
      <Breadcrumb items={[{ name: "Home", url: "/" }]} />

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

      {/* Hero Banner */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&q=75&auto=format"
            alt="Shop everything you need at Junavoo"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="container mx-auto px-6 max-w-7xl text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                Discover Amazing Deals
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-medium mb-8 leading-relaxed">
                Shop our curated collection of premium products at unbeatable prices
              </p>
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Shop Now <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
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
            <div ref={categoriesRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {categories
                .filter(cat => [
                  "toys",
                  "gym-sports",
                  "cosmetics",
                  "garden-outdoor",
                  "home-kitchen",
                  "tools",
                  "electronics-tech",
                  "clothing",
                ].includes(cat.slug))
                .map(cat => (
                  <Link key={cat.id} to={`/category/${cat.slug}`} className="cat-card group block">
                    <div className="rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group-hover:-translate-y-2">
                      <div className="relative h-32">
                        <img
                          src={
                            categoryBanners[cat.slug] ||
                            "/placeholder.svg"
                          }
                          alt={`Shop ${cat.name} - premium products for your needs`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      </div>
                      <div className="p-4 text-center">
                        <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{cat.name}</span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Shop at Junavo */}
      <section className="py-16 bg-slate-50/50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800" aria-label="Why choose Junavo">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Why Shop at Junavo</h2>
            <div className="h-1.5 w-16 bg-blue-600 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Curated Quality", desc: "Every product is hand-picked for quality and durability." },
              { icon: Truck, title: "Unbeatable Prices", desc: "We offer competitive pricing on all premium products." },
              { icon: RefreshCw, title: "Fast EU Delivery", desc: "Quick shipping across Europe with real-time tracking." },
            ].map((item, i) => (
              <Link key={i} to="/about" className="block text-center p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:shadow-lg transition-shadow">
                <item.icon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Trending Now</h2>
            <div className="h-1.5 w-16 bg-blue-600 rounded-full" />
            <Link to="/shop?sort=newest" className="mt-6 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 group">
              See All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingProducts.map(p => (
              <div key={p.id}>
                <ProductCard product={mapProduct(p)} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Reviews */}
      <section className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">What Our Customers Say</h2>
            <div className="h-1.5 w-16 bg-blue-600 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto" id="reviews">
            {[
              { name: "Sarah M.", rating: 5, text: "Amazing quality toys! My kids love them and they're durable.", product: "Toys Collection" },
              { name: "James T.", rating: 5, text: "Fast shipping and excellent customer service. Highly recommend!", product: "Home & Kitchen" },
              { name: "Elena R.", rating: 4, text: "Great prices on cosmetics. Will be ordering again soon.", product: "Cosmetics" },
            ].map((review, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`h-4 w-4 ${j < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                  ))}
                </div>
                <p className="text-sm mb-3">"{review.text}"</p>
                <p className="text-xs text-muted-foreground">— {review.name}, {review.product}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-24 md:py-40 bg-slate-50/50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">From Our Blog</h2>
            <div className="h-1.5 w-16 bg-blue-600 rounded-full" />
            <Link to="/blog" className="mt-6 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
              View All Posts
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "10 Kitchen Essentials Every Home Needs", 
                slug: "kitchen-essentials", 
                category: "Home Tips",
                image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=400&fit=crop&q=75&auto=format",
                excerpt: "Discover the must-have kitchen tools and appliances that every modern home needs for efficient cooking and meal preparation."
              },
              { 
                title: "Choosing the Right Toys for Your Child's Age", 
                slug: "choosing-toys", 
                category: "Guides",
                image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=400&fit=crop&q=75&auto=format",
                excerpt: "Learn how to select age-appropriate toys that are safe, educational, and fun for your child's developmental stage."
              },
              { 
                title: "Summer Sports Gear: What's Trending", 
                slug: "summer-sports", 
                category: "Sports",
                image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop&q=75&auto=format",
                excerpt: "Explore the latest sports equipment and gear trending this summer for outdoor activities and fitness enthusiasts."
              },
            ].map((post, i) => (
              <Link key={i} to={`/blog/${post.slug}`} className="block group">
                <div className="rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{post.category}</span>
                    <h3 className="text-lg font-bold mt-2 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-40 bg-slate-50/50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800" aria-label="Frequently Asked Questions">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-6">
              <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Frequently Asked Questions</h2>
            <div className="h-1.5 w-16 bg-blue-600 rounded-full mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl">
              Find answers to common questions about shipping, returns, payments, and more.
            </p>
            <Link to="/faq" className="mt-6 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2 group">
              View All FAQs <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }} />
          <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-b border-slate-200 dark:border-slate-800 last:border-0">
                  <AccordionTrigger className="px-6 py-5 text-left hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                    <span className="font-semibold text-base">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-0 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

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

      {/* CardFlip Section */}
      <section className="py-20 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Featured Collections</h2>
            <div className="h-1.5 w-16 bg-blue-600 rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <CardFlip
              title="Toys Collection"
              subtitle="Fun & Learning for Kids"
              description="Discover our exciting range of safe and creative toys."
              features={[
                "Safe Materials",
                "Educational Toys", 
                "Best Sellers",
                "Affordable Prices"
              ]}
              buttonText="Shop Toys"
              buttonLink="/category/toys"
              image="https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&h=600&fit=crop&q=75&auto=format"
            />
            
            <CardFlip
              title="Home & Kitchen"
              subtitle="Essentials for Everyday Living"
              description="Upgrade your home with our premium kitchen and home products."
              features={[
                "Modern Designs",
                "Durable Quality",
                "Smart Storage", 
                "Trending Products"
              ]}
              buttonText="Shop Home & Kitchen"
              buttonLink="/category/home-kitchen"
              image="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=600&fit=crop&q=75&auto=format"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
