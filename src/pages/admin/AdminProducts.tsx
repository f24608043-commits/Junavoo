import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EUR_RATE = 0.84;
const USD_RATE = 1 / EUR_RATE; // ≈1.19

const emptyProduct = {
  name: "", slug: "", price_usd: 0, price_eur: 0, compare_price: 0, cost: 0, sku: "", barcode: "",
  rating: 0, stock: 0, min_stock_alert: 5, short_description: "", long_description: "",
  image: "/placeholder.svg", category_id: "", brand_id: "", featured: false, active: true,
  weight: 0, tax_class: "standard", seo_title: "", seo_description: "", seo_keywords: "", tags: [] as string[],
};

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyProduct);
  const [search, setSearch] = useState("");
  const [stockHistory, setStockHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyProductName, setHistoryProductName] = useState("");
  const [priceMode, setPriceMode] = useState<"usd" | "eur">("usd");

  const fetchData = async () => {
    const [p, c, b] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
      supabase.from("brands").select("*").order("name"),
    ]);
    setProducts(p.data || []);
    setCategories(c.data || []);
    setBrands(b.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const openEdit = (p: any) => {
    setEditing(p);
    const usdPrice = Number(p.price);
    setForm({
      name: p.name, slug: p.slug || "", price_usd: usdPrice,
      price_eur: +(usdPrice * EUR_RATE).toFixed(2),
      compare_price: p.compare_price || 0,
      cost: p.cost || 0, sku: p.sku, barcode: p.barcode || "", rating: p.rating,
      stock: p.stock, min_stock_alert: p.min_stock_alert || 5,
      short_description: p.short_description || "", long_description: p.long_description || "",
      image: p.image || "/placeholder.svg", category_id: p.category_id || "",
      brand_id: p.brand_id || "", featured: p.featured, active: p.active,
      weight: p.weight || 0, tax_class: p.tax_class || "standard",
      seo_title: p.seo_title || "", seo_description: p.seo_description || "",
      seo_keywords: p.seo_keywords || "", tags: p.tags || [],
    });
    setOpen(true);
  };

  const openNew = () => { setEditing(null); setForm(emptyProduct); setOpen(true); };

  // Auto-sync USD ↔ EUR
  const handleUSDChange = (val: number) => {
    setForm(prev => ({ ...prev, price_usd: val, price_eur: +(val * EUR_RATE).toFixed(2) }));
  };
  const handleEURChange = (val: number) => {
    setForm(prev => ({ ...prev, price_eur: val, price_usd: +(val * USD_RATE).toFixed(2) }));
  };

  const handleSave = async () => {
    const slug = form.slug || generateSlug(form.name);
    const finalPriceUSD = priceMode === "eur"
      ? +(form.price_eur * USD_RATE).toFixed(2)
      : form.price_usd;

    const payload: any = {
      name: form.name, slug, price: finalPriceUSD, compare_price: form.compare_price,
      cost: form.cost, sku: form.sku, barcode: form.barcode || null,
      rating: form.rating, stock: form.stock, min_stock_alert: form.min_stock_alert,
      short_description: form.short_description, long_description: form.long_description,
      image: form.image, category_id: form.category_id || null,
      brand_id: form.brand_id || null, featured: form.featured, active: form.active,
      weight: form.weight, tax_class: form.tax_class,
      seo_title: form.seo_title || null, seo_description: form.seo_description || null,
      seo_keywords: form.seo_keywords || null, tags: form.tags,
    };

    if (editing) {
      if (editing.stock !== form.stock) {
        const { data: { session } } = await supabase.auth.getSession();
        await supabase.from("stock_history").insert({
          product_id: editing.id, admin_id: session?.user?.id || null,
          change_type: "manual", previous_quantity: editing.stock,
          new_quantity: form.stock, reason: "Manual update from admin",
        });
      }
      await supabase.from("products").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("products").insert(payload);
    }
    setOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    fetchData();
  };

  const viewStockHistory = async (product: any) => {
    setHistoryProductName(product.name);
    const { data } = await supabase.from("stock_history").select("*").eq("product_id", product.id).order("created_at", { ascending: false });
    setStockHistory(data || []);
    setShowHistory(true);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Products ({products.length})</h1>
        <div className="flex gap-2">
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-48" />
          <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" />Add Product</Button>
        </div>
      </div>

      <div className="rounded border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>USD Price</TableHead>
              <TableHead>EUR Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                <TableCell>${Number(p.price).toFixed(2)}</TableCell>
                <TableCell>€{(Number(p.price) * EUR_RATE).toFixed(2)}</TableCell>
                <TableCell>
                  <span className={p.stock === 0 ? "text-destructive font-bold" : p.stock <= (p.min_stock_alert || 5) ? "text-orange-500 font-medium" : ""}>
                    {p.stock}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {p.featured && <Badge variant="secondary" className="text-[10px]">Featured</Badge>}
                    <Badge variant={p.active ? "default" : "outline"} className="text-[10px]">{p.active ? "Active" : "Inactive"}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => viewStockHistory(p)}><History className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-3 mt-3">
              <Input placeholder="Product Name" value={form.name} onChange={e => { setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) }); }} />
              <Input placeholder="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Select value={form.category_id} onValueChange={v => setForm({ ...form, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={form.brand_id} onValueChange={v => setForm({ ...form, brand_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Brand" /></SelectTrigger>
                  <SelectContent>{brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Input placeholder="Short description" value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })} />
              <Textarea placeholder="Full description" rows={4} value={form.long_description} onChange={e => setForm({ ...form, long_description: e.target.value })} />
              <Input placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm"><Switch checked={form.featured} onCheckedChange={v => setForm({ ...form, featured: v })} /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /> Active</label>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4 mt-3">
              {/* Currency selector for price input */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Enter price in:</span>
                <div className="flex border rounded-lg overflow-hidden text-xs font-medium">
                  <button onClick={() => setPriceMode("usd")} className={`px-3 py-1.5 transition-colors ${priceMode === "usd" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>USD ($)</button>
                  <button onClick={() => setPriceMode("eur")} className={`px-3 py-1.5 transition-colors ${priceMode === "eur" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>EUR (€)</button>
                </div>
                <span className="text-xs text-muted-foreground">1 USD = €{EUR_RATE} • Auto-converted</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Price (USD $)</label>
                  <Input type="number" step="0.01" value={form.price_usd} onChange={e => handleUSDChange(+e.target.value)} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Price (EUR €)</label>
                  <Input type="number" step="0.01" value={form.price_eur} onChange={e => handleEURChange(+e.target.value)} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Compare Price (USD)</label>
                  <Input type="number" step="0.01" value={form.compare_price} onChange={e => setForm({ ...form, compare_price: +e.target.value })} className="mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Cost Price (USD)</label>
                  <Input type="number" step="0.01" value={form.cost} onChange={e => setForm({ ...form, cost: +e.target.value })} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Tax Class</label>
                  <Select value={form.tax_class} onValueChange={v => setForm({ ...form, tax_class: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="reduced">Reduced</SelectItem>
                      <SelectItem value="zero">Zero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Weight (kg)</label>
                  <Input type="number" step="0.01" value={form.weight} onChange={e => setForm({ ...form, weight: +e.target.value })} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-3 mt-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">SKU</label><Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} /></div>
                <div><label className="text-xs text-muted-foreground">Barcode</label><Input value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs text-muted-foreground">Stock Quantity</label><Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })} /></div>
                <div><label className="text-xs text-muted-foreground">Low Stock Alert</label><Input type="number" value={form.min_stock_alert} onChange={e => setForm({ ...form, min_stock_alert: +e.target.value })} /></div>
                <div><label className="text-xs text-muted-foreground">Rating</label><Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: +e.target.value })} /></div>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-3 mt-3">
              <Input placeholder="SEO Title" value={form.seo_title} onChange={e => setForm({ ...form, seo_title: e.target.value })} />
              <Textarea placeholder="SEO Description" value={form.seo_description} onChange={e => setForm({ ...form, seo_description: e.target.value })} />
              <Input placeholder="SEO Keywords (comma separated)" value={form.seo_keywords} onChange={e => setForm({ ...form, seo_keywords: e.target.value })} />
            </TabsContent>
          </Tabs>
          <Button className="w-full mt-4" onClick={handleSave}>{editing ? "Update Product" : "Create Product"}</Button>
        </DialogContent>
      </Dialog>

      {/* Stock History */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Stock History: {historyProductName}</DialogTitle></DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockHistory.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-4">No history</TableCell></TableRow>}
              {stockHistory.map(h => (
                <TableRow key={h.id}>
                  <TableCell className="text-xs">{new Date(h.created_at).toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{h.change_type}</TableCell>
                  <TableCell>{h.previous_quantity}</TableCell>
                  <TableCell>{h.new_quantity}</TableCell>
                  <TableCell className="text-xs">{h.reason || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
