import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, CheckCircle, XCircle } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [products, setProducts] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("all");

  const fetchData = async () => {
    const [r, p] = await Promise.all([
      supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("id, name"),
    ]);
    setReviews(r.data || []);
    const map: Record<string, string> = {};
    (p.data || []).forEach(prod => { map[prod.id] = prod.name; });
    setProducts(map);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("reviews").update({ status }).eq("id", id);
    fetchData();
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    fetchData();
  };

  const filtered = filter === "all" ? reviews : reviews.filter(r => r.status === filter);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Reviews ({reviews.length})</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded border bg-card">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Product</TableHead><TableHead>Rating</TableHead><TableHead>Title</TableHead>
            <TableHead>Status</TableHead><TableHead>Verified</TableHead><TableHead>Date</TableHead><TableHead className="w-32">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No reviews</TableCell></TableRow>
            )}
            {filtered.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{products[r.product_id] || "Unknown"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-orange-500" />{r.rating}
                  </div>
                </TableCell>
                <TableCell className="max-w-48 truncate">{r.title || r.content?.slice(0, 50) || "-"}</TableCell>
                <TableCell><Badge className={statusColors[r.status]}>{r.status}</Badge></TableCell>
                <TableCell>{r.verified_purchase ? "Yes" : "No"}</TableCell>
                <TableCell className="text-xs">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {r.status !== "approved" && (
                      <Button variant="ghost" size="icon" onClick={() => updateStatus(r.id, "approved")}><CheckCircle className="h-4 w-4 text-green-600" /></Button>
                    )}
                    {r.status !== "rejected" && (
                      <Button variant="ghost" size="icon" onClick={() => updateStatus(r.id, "rejected")}><XCircle className="h-4 w-4 text-orange-500" /></Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => deleteReview(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
