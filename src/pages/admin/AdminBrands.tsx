import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";

const empty = { name: "", slug: "", logo: "", description: "", seo_title: "", seo_description: "", active: true };

export default function AdminBrands() {
  const [brands, setBrands] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(empty);

  const fetchData = async () => {
    const { data } = await supabase.from("brands").select("*").order("name");
    setBrands(data || []);
  };
  useEffect(() => { fetchData(); }, []);

  const genSlug = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const openEdit = (b: any) => {
    setEditing(b);
    setForm({ name: b.name, slug: b.slug, logo: b.logo || "", description: b.description || "", seo_title: b.seo_title || "", seo_description: b.seo_description || "", active: b.active });
    setOpen(true);
  };

  const handleSave = async () => {
    const slug = form.slug || genSlug(form.name);
    const payload = { ...form, slug, logo: form.logo || null, seo_title: form.seo_title || null, seo_description: form.seo_description || null };
    if (editing) {
      await supabase.from("brands").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("brands").insert(payload);
    }
    setOpen(false); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this brand?")) return;
    await supabase.from("brands").delete().eq("id", id);
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Brands</h1>
        <Button size="sm" onClick={() => { setEditing(null); setForm(empty); setOpen(true); }}><Plus className="h-4 w-4 mr-1" />Add Brand</Button>
      </div>
      <div className="rounded border bg-card">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Active</TableHead><TableHead className="w-24">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {brands.map(b => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.name}</TableCell>
                <TableCell>{b.slug}</TableCell>
                <TableCell>{b.active ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Brand" : "Add Brand"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: genSlug(e.target.value) })} />
            <Input placeholder="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
            <Input placeholder="Logo URL" value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })} />
            <Textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <Input placeholder="SEO Title" value={form.seo_title} onChange={e => setForm({ ...form, seo_title: e.target.value })} />
            <Input placeholder="SEO Description" value={form.seo_description} onChange={e => setForm({ ...form, seo_description: e.target.value })} />
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} />Active</label>
            <Button className="w-full" onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
