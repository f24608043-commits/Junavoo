import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { useSearchParams } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ITEMS_PER_PAGE = 9;

export default function Shop() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [sort, setSort] = useState("default");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const { t, formatPrice } = useLocale();
  const gridRef = useRef<HTMLDivElement>(null);

  const { products: dbProducts, loading } = useProducts();
  const { categories } = useCategories();

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

  const filtered = useMemo(() => {
    let products = [...dbProducts];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || (p.short_description || "").toLowerCase().includes(q));
    }
    if (selectedCategories.length > 0) {
      products = products.filter(p => selectedCategories.includes(p.category_id || ""));
    }
    products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (minRating > 0) products = products.filter(p => p.rating >= minRating);
    if (inStockOnly) products = products.filter(p => p.stock > 0);
    switch (sort) {
      case "price-asc": products.sort((a, b) => a.price - b.price); break;
      case "price-desc": products.sort((a, b) => b.price - a.price); break;
      case "rating": products.sort((a, b) => b.rating - a.rating); break;
      case "name": products.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return products;
  }, [dbProducts, searchQuery, selectedCategories, priceRange, minRating, inStockOnly, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".product-card-item");
    gsap.fromTo(cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }
    );
  }, [paged.length, page]);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    setPage(1);
  };

  const Sidebar = () => (
    <div className="space-y-7">
      <div>
        <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">{t("categories")}</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox id={cat.id} checked={selectedCategories.includes(cat.id)} onCheckedChange={() => toggleCategory(cat.id)} className="rounded-md" />
              <Label htmlFor={cat.id} className="text-sm cursor-pointer font-medium">{cat.name}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Price Range</h3>
        <Slider min={0} max={1000} step={5} value={priceRange} onValueChange={v => { setPriceRange(v); setPage(1); }} className="mt-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{formatPrice(priceRange[0])}</span><span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Min Rating</h3>
        <Select value={String(minRating)} onValueChange={v => { setMinRating(Number(v)); setPage(1); }}>
          <SelectTrigger className="h-9 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Ratings</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="4.5">4.5+ Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="instock" checked={inStockOnly} onCheckedChange={(v) => { setInStockOnly(!!v); setPage(1); }} className="rounded-md" />
        <Label htmlFor="instock" className="text-sm cursor-pointer font-medium">In Stock Only</Label>
      </div>
      {(selectedCategories.length > 0 || minRating > 0 || inStockOnly) && (
        <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={() => { setSelectedCategories([]); setMinRating(0); setInStockOnly(false); setPage(1); }}>
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {searchQuery ? `${t("resultsFor")} "${searchQuery}"` : t("allProducts")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{filtered.length} products</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="md:hidden rounded-xl" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-1" /> Filters
            </Button>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-9 w-[160px] rounded-xl"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-asc">Price: Low–High</SelectItem>
                <SelectItem value="price-desc">Price: High–Low</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="name">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden md:block w-60 shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </aside>

          {showFilters && (
            <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-6 overflow-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg">Filters</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}><X className="h-5 w-5" /></Button>
              </div>
              <Sidebar />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border bg-muted animate-pulse aspect-[3/4]" />
                ))}
              </div>
            ) : paged.length === 0 ? (
              <p className="text-muted-foreground text-center py-24">{t("noProducts")}</p>
            ) : (
              <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {paged.map(p => (
                  <div key={p.id} className="product-card-item">
                    <ProductCard product={mapProduct(p)} />
                  </div>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="rounded-xl w-10"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
