import Layout from "@/components/Layout";
import { useCart } from "@/contexts/CartContext";
import { DEMO_PRODUCTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLocale } from "@/contexts/LocaleContext";

const COUPONS: Record<string, number> = { SAVE10: 10, JUNAVO20: 20 };

export default function Cart() {
  const { items, removeItem, updateQuantity, totalItems } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const { formatPrice, t } = useLocale();

  const cartProducts = items.map(item => {
    const product = DEMO_PRODUCTS.find(p => p.id === item.productId);
    return product ? { ...product, qty: item.quantity } : null;
  }).filter(Boolean) as (typeof DEMO_PRODUCTS[0] & { qty: number })[];

  const subtotal = cartProducts.reduce((sum, p) => sum + p.price * p.qty, 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = Math.max(0, subtotal - discount + shipping);

  const applyCoupon = () => {
    const d = COUPONS[coupon.toUpperCase()];
    if (d) { setDiscount(d); setCouponMsg(`✓ Coupon applied: -$${d}`); }
    else { setDiscount(0); setCouponMsg("✗ Invalid coupon code"); }
  };

  if (totalItems === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-32 text-center max-w-md">
          <ShoppingBag className="h-16 w-16 text-muted mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-3">{t("cartEmpty")}</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
          <Button asChild className="rounded-xl">
            <Link to="/shop">{t("continueShopping")}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">{t("cart")}</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-3">
            {cartProducts.map(p => (
              <div key={p.id} className="flex gap-4 rounded-2xl border bg-card p-4">
                <div className="w-20 h-20 bg-muted rounded-xl flex-shrink-0 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${p.id}`} className="text-sm font-semibold hover:text-primary line-clamp-1 transition-colors">{p.name}</Link>
                  <p className="text-sm font-bold mt-1">{formatPrice(p.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none" onClick={() => updateQuantity(p.id, p.qty - 1)}><Minus className="h-3 w-3" /></Button>
                      <span className="w-8 text-center text-xs font-semibold border-x">{p.qty}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none" onClick={() => updateQuantity(p.id, p.qty + 1)}><Plus className="h-3 w-3" /></Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => removeItem(p.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm font-bold whitespace-nowrap">{formatPrice(p.price * p.qty)}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border bg-card p-6 h-fit space-y-4 lg:sticky lg:top-24">
            <h2 className="font-bold text-lg">{t("orderSummary")}</h2>
            <div className="flex gap-2">
              <Input placeholder={t("couponCode")} value={coupon} onChange={e => setCoupon(e.target.value)} className="h-9 rounded-xl" />
              <Button variant="outline" size="sm" onClick={applyCoupon} className="rounded-xl shrink-0">{t("apply")}</Button>
            </div>
            {couponMsg && <p className={`text-xs font-medium ${discount > 0 ? "text-primary" : "text-destructive"}`}>{couponMsg}</p>}
            <div className="space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between"><span className="text-muted-foreground">{t("subtotal")}</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between"><span className="text-muted-foreground">{t("discount")}</span><span className="text-primary font-semibold">-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted-foreground">{t("shipping")}</span><span>{shipping === 0 ? <span className="text-primary font-semibold">{t("free")}</span> : formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-bold text-base border-t pt-3"><span>{t("total")}</span><span>{formatPrice(total)}</span></div>
            </div>
            <Button className="w-full rounded-xl font-semibold h-11" asChild>
              <Link to="/checkout">{t("proceedToCheckout")}</Link>
            </Button>
            <Link to="/shop" className="block text-center text-xs text-muted-foreground hover:text-foreground">{t("continueShopping")}</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
