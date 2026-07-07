import Layout from "@/components/Layout";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const { items, clearCart } = useCart();
  const { products: dbProducts } = useProducts();
  const navigate = useNavigate();
  const { formatPrice, t, currency } = useLocale();
  const { toast } = useToast();
  const [payment, setPayment] = useState("cod");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "", city: "", zip: ""
  });

  const cartProducts = useMemo(() => items.map(item => {
    const product = dbProducts.find(p => p.id === item.productId);
    if (!product) return null;
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      price_eur: product.price_eur,
      image: product.image || "/placeholder.svg",
      qty: item.quantity,
    };
  }).filter(Boolean) as { id: string; name: string; price: number; price_eur: number | null; image: string; qty: number }[], [items, dbProducts]);

  const getItemPrice = (p: typeof cartProducts[0]) =>
    currency === "EUR" && p.price_eur != null ? p.price_eur : p.price;

  const subtotal = cartProducts.reduce((sum, p) => sum + getItemPrice(p) * p.qty, 0);
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: session?.user?.id || null,
          billing_name: `${form.firstName} ${form.lastName}`.trim(),
          billing_email: form.email,
          billing_phone: form.phone,
          billing_address: form.address,
          billing_city: form.city,
          billing_zip: form.zip,
          shipping_name: `${form.firstName} ${form.lastName}`.trim(),
          shipping_address: form.address,
          shipping_city: form.city,
          shipping_zip: form.zip,
          payment_method: payment,
          subtotal,
          shipping,
          discount: 0,
          total,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartProducts.map(p => ({
        order_id: order.id,
        product_id: p.id,
        product_name: p.name,
        quantity: p.qty,
        price: getItemPrice(p),
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      navigate("/order-confirmation");
    } catch (err: any) {
      toast({
        title: "Order failed",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("cartEmpty")}</h1>
          <Button asChild><a href="/shop">{t("continueShopping")}</a></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border bg-card p-6 space-y-4">
              <h2 className="font-bold text-lg">{t("billingDetails")}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">{t("firstName")}</Label><Input required value={form.firstName} onChange={handleChange("firstName")} className="mt-1 rounded-xl" /></div>
                <div><Label className="text-xs text-muted-foreground">{t("lastName")}</Label><Input required value={form.lastName} onChange={handleChange("lastName")} className="mt-1 rounded-xl" /></div>
                <div className="sm:col-span-2"><Label className="text-xs text-muted-foreground">{t("email")}</Label><Input type="email" required value={form.email} onChange={handleChange("email")} className="mt-1 rounded-xl" /></div>
                <div className="sm:col-span-2"><Label className="text-xs text-muted-foreground">{t("phone")}</Label><Input required value={form.phone} onChange={handleChange("phone")} className="mt-1 rounded-xl" /></div>
                <div className="sm:col-span-2"><Label className="text-xs text-muted-foreground">{t("address")}</Label><Input required value={form.address} onChange={handleChange("address")} className="mt-1 rounded-xl" /></div>
                <div><Label className="text-xs text-muted-foreground">{t("city")}</Label><Input required value={form.city} onChange={handleChange("city")} className="mt-1 rounded-xl" /></div>
                <div><Label className="text-xs text-muted-foreground">{t("zipCode")}</Label><Input required value={form.zip} onChange={handleChange("zip")} className="mt-1 rounded-xl" /></div>
              </div>
            </div>
            <div className="rounded-2xl border bg-card p-6 space-y-4">
              <h2 className="font-bold text-lg">{t("paymentMethod")}</h2>
              <RadioGroup value={payment} onValueChange={setPayment} className="space-y-3">
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment === "cod" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <RadioGroupItem value="cod" id="cod" />
                  <div><p className="font-medium text-sm">{t("cashOnDelivery")}</p><p className="text-xs text-muted-foreground">Pay when your order arrives</p></div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment === "card" ? "border-primary bg-primary/5" : "border-border"} opacity-60`}>
                  <RadioGroupItem value="card" id="card" disabled />
                  <div><p className="font-medium text-sm">{t("creditCard")}</p></div>
                </label>
              </RadioGroup>
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-6 h-fit space-y-4 lg:sticky lg:top-24">
            <h2 className="font-bold text-lg">{t("orderSummary")}</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cartProducts.map(p => (
                <div key={p.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground line-clamp-1 mr-2">{p.name} ×{p.qty}</span>
                  <span className="whitespace-nowrap font-medium">{formatPrice(getItemPrice(p) * p.qty)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between"><span className="text-muted-foreground">{t("subtotal")}</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("shipping")}</span><span>{shipping === 0 ? t("free") : formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-bold text-base border-t pt-3"><span>{t("total")}</span><span>{formatPrice(total)}</span></div>
            </div>
            <Button type="submit" className="w-full rounded-xl font-semibold" disabled={submitting}>
              {submitting ? "Processing..." : t("placeOrder")}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground">🔒 Secure checkout. Your data is protected.</p>
          </div>
        </form>
      </div>
    </Layout>
  );
}
