import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminLogs() {
  const [adminLogs, setAdminLogs] = useState<any[]>([]);
  const [stockLogs, setStockLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const [a, s] = await Promise.all([
        supabase.from("admin_logs").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("stock_history").select("*").order("created_at", { ascending: false }).limit(100),
      ]);
      setAdminLogs(a.data || []);
      setStockLogs(s.data || []);
    };
    fetch();
  }, []);

  const filteredAdmin = adminLogs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    (l.entity_type || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">System Logs</h1>
        <Input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
      </div>

      <Tabs defaultValue="admin">
        <TabsList>
          <TabsTrigger value="admin">Admin Activity</TabsTrigger>
          <TabsTrigger value="stock">Stock Changes</TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="mt-4">
          <div className="rounded border bg-card">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Date</TableHead><TableHead>Action</TableHead><TableHead>Entity</TableHead><TableHead>Details</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {filteredAdmin.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No logs yet</TableCell></TableRow>
                )}
                {filteredAdmin.map(l => (
                  <TableRow key={l.id}>
                    <TableCell className="text-xs">{new Date(l.created_at).toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{l.action}</TableCell>
                    <TableCell>{l.entity_type} {l.entity_id ? `#${l.entity_id.slice(0, 8)}` : ""}</TableCell>
                    <TableCell className="text-xs max-w-48 truncate">{JSON.stringify(l.details)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="stock" className="mt-4">
          <div className="rounded border bg-card">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>From → To</TableHead><TableHead>Reason</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {stockLogs.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No stock changes yet</TableCell></TableRow>
                )}
                {stockLogs.map(l => (
                  <TableRow key={l.id}>
                    <TableCell className="text-xs">{new Date(l.created_at).toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{l.change_type}</TableCell>
                    <TableCell>{l.previous_quantity} → {l.new_quantity}</TableCell>
                    <TableCell className="text-xs">{l.reason || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
