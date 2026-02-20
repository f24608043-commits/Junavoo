import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Tables } from "@/integrations/supabase/types";

type Subscriber = Tables<"subscribers">;

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("subscribers").select("*").order("created_at", { ascending: false });
      setSubscribers(data || []);
    };
    fetch();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Newsletter Subscribers ({subscribers.length})</h1>
      <div className="rounded border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Subscribed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.length === 0 && (
              <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-8">No subscribers yet</TableCell></TableRow>
            )}
            {subscribers.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.email}</TableCell>
                <TableCell>{new Date(s.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
