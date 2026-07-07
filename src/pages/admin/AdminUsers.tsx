import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminUsers() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [roles, setRoles] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);

  const fetchData = async () => {
    const [p, r] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);
    setProfiles(p.data || []);
    const roleMap: Record<string, string[]> = {};
    (r.data || []).forEach(ur => {
      if (!roleMap[ur.user_id]) roleMap[ur.user_id] = [];
      roleMap[ur.user_id].push(ur.role);
    });
    setRoles(roleMap);
  };

  useEffect(() => { fetchData(); }, []);

  const viewUser = async (profile: any) => {
    setSelected(profile);
    const { data } = await supabase.from("orders").select("*").eq("user_id", profile.user_id).order("created_at", { ascending: false }).limit(10);
    setUserOrders(data || []);
  };

  const filtered = profiles.filter(p =>
    (p.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.display_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Users ({profiles.length})</h1>
        <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
      </div>
      <div className="rounded border bg-card">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Roles</TableHead><TableHead>Joined</TableHead><TableHead>Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.display_name || "N/A"}</TableCell>
                <TableCell>{p.email}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {(roles[p.user_id] || ["user"]).map(r => (
                      <Badge key={r} variant={r === "super_admin" ? "destructive" : r === "admin" ? "default" : "secondary"} className="text-xs">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-xs">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <button className="text-sm text-primary underline" onClick={() => viewUser(p)}>View</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><p className="text-muted-foreground text-xs">Name</p><p className="font-medium">{selected.display_name || "N/A"}</p></div>
                <div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium">{selected.email}</p></div>
                <div><p className="text-muted-foreground text-xs">Phone</p><p>{selected.phone || "N/A"}</p></div>
                <div><p className="text-muted-foreground text-xs">Address</p><p>{selected.address || "N/A"}</p></div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">Roles</p>
                <div className="flex gap-1">
                  {(roles[selected.user_id] || ["user"]).map(r => (
                    <Badge key={r} variant="secondary">{r}</Badge>
                  ))}
                </div>
              </div>
              <hr />
              <p className="font-medium">Recent Orders ({userOrders.length})</p>
              {userOrders.map(o => (
                <div key={o.id} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-mono text-xs">{o.id.slice(0, 8)}...</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${Number(o.total).toFixed(2)}</p>
                    <p className="text-xs capitalize">{o.status}</p>
                  </div>
                </div>
              ))}
              {userOrders.length === 0 && <p className="text-muted-foreground">No orders</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
