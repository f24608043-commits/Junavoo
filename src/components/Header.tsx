import { Link } from "react-router-dom";
import { Search, User, Heart, ShoppingCart, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useCategories } from "@/hooks/use-categories";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { language, currency, setLanguage, setCurrency, t } = useLocale();
  const { categories } = useCategories();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { y: -8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "shadow-md border-b" : "border-b border-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center gap-4 px-6 max-w-7xl">
        <Link to="/" className="text-2xl font-bold shrink-0 tracking-tight">
          <span className="text-foreground">Jun</span><span className="orange-accent">avo</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-muted/60 border-transparent focus:border-border focus:bg-background transition-all"
            />
          </div>
        </form>

        <div className="flex items-center gap-1 shrink-0 ml-auto">
          <div className="hidden md:flex items-center border rounded-lg overflow-hidden text-xs font-medium">
            <button onClick={() => setLanguage("en")} className={`px-2.5 py-1.5 transition-colors ${language === "en" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>EN</button>
            <button onClick={() => setLanguage("it")} className={`px-2.5 py-1.5 transition-colors ${language === "it" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>IT</button>
          </div>
          <div className="hidden md:flex items-center border rounded-lg overflow-hidden text-xs font-medium ml-1">
            <button onClick={() => setCurrency("USD")} className={`px-2.5 py-1.5 transition-colors ${currency === "USD" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>$</button>
            <button onClick={() => setCurrency("EUR")} className={`px-2.5 py-1.5 transition-colors ${currency === "EUR" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>€</button>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="rounded-xl">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" asChild className="rounded-xl">
            <Link to="/account" aria-label="Account"><User className="h-4 w-4" /></Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative rounded-xl">
            <Link to="/wishlist" aria-label={t("wishlist")}>
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-accent text-[10px] font-bold text-white flex items-center justify-center animate-count">{wishlistCount}</span>}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative rounded-xl">
            <Link to="/cart" aria-label={t("cart")}>
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-accent text-[10px] font-bold text-white flex items-center justify-center animate-count">{totalItems}</span>}
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden rounded-xl" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <nav className="hidden md:block border-t border-border/50">
        <div className="container mx-auto flex items-center gap-8 px-6 h-10 text-sm max-w-7xl">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">{t("home")}</Link>
          <Link to="/shop" className="text-muted-foreground hover:text-foreground transition-colors font-medium">{t("shop")}</Link>
          {categories.length > 0 && (
            <div className="relative group">
              <button className="text-muted-foreground hover:text-foreground transition-colors font-medium">{t("categories")}</button>
              <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                <div className="bg-popover border rounded-2xl shadow-lg py-2 min-w-[240px] grid grid-cols-2 gap-0.5 p-2">
                  {categories.map(cat => (
                    <Link key={cat.id} to={`/category/${cat.slug}`} className="block px-3 py-2 text-sm text-popover-foreground hover:bg-muted rounded-xl transition-colors">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
          <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors font-medium">{t("blog")}</Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors font-medium">{t("about")}</Link>
          <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors font-medium">{t("contact")}</Link>
        </div>
      </nav>

      {mobileOpen && (
        <nav className="md:hidden border-t bg-background/98 backdrop-blur-md">
          <div className="px-6 py-4 space-y-3">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t("searchPlaceholder")} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9 h-10 rounded-xl" />
              </div>
            </form>
            <div className="flex gap-2 pb-2">
              <div className="flex items-center border rounded-lg overflow-hidden text-xs font-medium">
                <button onClick={() => setLanguage("en")} className={`px-2.5 py-1.5 ${language === "en" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>EN</button>
                <button onClick={() => setLanguage("it")} className={`px-2.5 py-1.5 ${language === "it" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>IT</button>
              </div>
              <div className="flex items-center border rounded-lg overflow-hidden text-xs font-medium">
                <button onClick={() => setCurrency("USD")} className={`px-2.5 py-1.5 ${currency === "USD" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>USD</button>
                <button onClick={() => setCurrency("EUR")} className={`px-2.5 py-1.5 ${currency === "EUR" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>EUR</button>
              </div>
            </div>
            {[
              { to: "/", label: t("home") },
              { to: "/shop", label: t("shop") },
              { to: "/blog", label: t("blog") },
              { to: "/about", label: t("about") },
              { to: "/contact", label: t("contact") },
            ].map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-foreground/80 hover:text-foreground">{link.label}</Link>
            ))}
            {categories.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">{t("categories")}</p>
                <div className="grid grid-cols-2 gap-1">
                  {categories.map(cat => (
                    <Link key={cat.id} to={`/category/${cat.slug}`} onClick={() => setMobileOpen(false)} className="text-xs py-1.5 text-foreground/70 hover:text-foreground">{cat.name}</Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
