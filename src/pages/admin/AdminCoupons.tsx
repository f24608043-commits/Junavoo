import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Coupon = Tables<"coupons">;

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [active, setActive] = useState(true);

  const fetch = async () => {
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    setCoupons(data || []);
  };

  useEffect(() => { fetch(); }, []);

  const openEdit = (c: Coupon) => {
    setEditing(c); setCode(c.code); setDiscount(c.discount); setActive(c.active); setOpen(true);
  };

  const openNew = () => {
    setEditing(null); setCode(""); setDiscount(0); setActive(true); setOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      await supabase.from("coupons").update({ code, discount, active }).eq("id", editing.id);
    } else {
      await supabase.from("coupons").insert({ code, discount, active });
    }
    setOpen(false); fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await supabase.from("coupons").delete().eq("id", id);
    fetch();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <Button size="sm" onClick={openNew}><Plus className="h-4 w-4 mr-1" />Add Coupon</Button>
      </div>
      <div className="rounded border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono font-medium">{c.code}</TableCell>
                <TableCell>${Number(c.discount).toFixed(2)}</TableCell>
                <TableCell>{c.active ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{editing ? "Edit Coupon" : "Add Coupon"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
            <Input placeholder="Discount ($)" type="number" step="0.01" value={discount} onChange={(e) => setDiscount(+e.target.value)} />
            <label className="flex items-center gap-2 text-sm"><Switch checked={active} onCheckedChange={setActive} />Active</label>
            <Button className="w-full" onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
