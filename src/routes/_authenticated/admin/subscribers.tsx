import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/subscribers")({
  component: SubscribersAdmin,
});

function SubscribersAdmin() {
  const qc = useQueryClient();

  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const del = async (id: string) => {
    if (!confirm("Remove subscriber?")) return;
    const { error } = await supabase.from("subscribers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "subscribers"] });
  };

  const exportCsv = () => {
    const header = "email,name,subscribed_at\n";
    const body = rows
      .map((r: any) => {
        const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
        return [esc(r.email), esc(r.name), esc(r.subscribed_at)].join(",");
      })
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Subscribers</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{rows.length} total</span>
          <Button variant="outline" onClick={exportCsv} disabled={rows.length === 0}>Export CSV</Button>
        </div>
      </div>

      <table className="mt-4 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2">Email</th>
            <th>Name</th>
            <th>Subscribed</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={4} className="py-3 text-muted-foreground">No subscribers.</td></tr>}
          {rows.map((r: any) => (
            <tr key={r.id} className="border-b border-border">
              <td className="py-2">{r.email}</td>
              <td>{r.name ?? "—"}</td>
              <td>{new Date(r.subscribed_at).toLocaleDateString()}</td>
              <td className="text-right">
                <button className="text-destructive underline" onClick={() => del(r.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}