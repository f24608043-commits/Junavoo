import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/reviews")({
  component: ReviewsAdmin,
});

function ReviewsAdmin() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "reviews", filter],
    queryFn: async () => {
      let q = supabase
        .from("reviews")
        .select("*, product:products(name,slug)")
        .order("created_at", { ascending: false });
      if (filter === "pending") q = q.eq("approved", false);
      if (filter === "approved") q = q.eq("approved", true);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const approve = async (id: string, approved: boolean) => {
    const { error } = await supabase.from("reviews").update({ approved }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <select
          className="rounded border border-input bg-background p-2 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="all">All</option>
        </select>
      </div>

      <div className="mt-4 space-y-3">
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No reviews.</p>}
        {rows.map((r: any) => (
          <div key={r.id} className="rounded border border-border p-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{r.product?.name ?? "Product"}</div>
                <div className="text-xs text-muted-foreground">
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)} · {new Date(r.created_at).toLocaleDateString()} · {r.approved ? "Approved" : "Pending"}
                </div>
              </div>
              <div className="flex gap-3">
                {!r.approved ? (
                  <button className="underline" onClick={() => approve(r.id, true)}>Approve</button>
                ) : (
                  <button className="underline" onClick={() => approve(r.id, false)}>Unapprove</button>
                )}
                <button className="text-destructive underline" onClick={() => del(r.id)}>Delete</button>
              </div>
            </div>
            {r.comment && <p className="mt-2">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}