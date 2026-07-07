import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useState } from "react";

export type ProductCardData = {
  id: string;
  name: string;
  price: number;       // USD
  price_eur?: number | null;  // EUR (independent)
  comparePrice?: number;
  sku: string;
  rating: number;
  stock: number;
  image: string;
  hover_image?: string | null;
  shortDescription?: string;
  longDescription?: string;
  categoryId?: string;
  featured?: boolean;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();
  const { currency, t } = useLocale();
  const inWishlist = hasItem(product.id);
  const [hovered, setHovered] = useState(false);

  const displayPrice = currency === "EUR" && product.price_eur != null
    ? `€${Number(product.price_eur).toFixed(2)}`
    : `$${Number(product.price).toFixed(2)}`;

  const compareDisplayPrice = product.comparePrice
    ? (currency === "EUR" ? `€${(Number(product.comparePrice) * 0.84).toFixed(2)}` : `$${Number(product.comparePrice).toFixed(2)}`)
    : null;

  const isOnSale = product.comparePrice && product.comparePrice > product.price;
  const discountPct = isOnSale ? Math.round((1 - product.price / product.comparePrice!) * 100) : 0;

  const showHoverImage = hovered && !!product.hover_image;
  const currentImage = showHoverImage ? product.hover_image! : product.image;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product.id);
    const btn = e.currentTarget as HTMLElement;
    btn.style.transform = "scale(0.92)";
    setTimeout(() => { btn.style.transform = ""; }, 150);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(product.id);
  };

  return (
    <div
      className="group relative bg-card rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
        <div className="aspect-square bg-muted overflow-hidden">
          <img
            src={currentImage || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {isOnSale && (
            <span className="bg-orange-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discountPct}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
              {t("outOfStock")}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-sm ${inWishlist ? "opacity-100" : ""}`}
        >
          <Heart className={`h-4 w-4 transition-colors ${inWishlist ? "fill-destructive text-destructive" : "text-foreground/60"}`} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-semibold leading-tight line-clamp-2 hover:text-primary transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs text-muted-foreground font-medium">{product.rating}</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-base font-bold">{displayPrice}</span>
            {isOnSale && compareDisplayPrice && (
              <span className="text-xs text-muted-foreground line-through">{compareDisplayPrice}</span>
            )}
          </div>
          <Button
            size="sm"
            className="h-10 w-10 rounded-xl transition-transform duration-150 p-0"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            aria-label={t("addToCart")}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
