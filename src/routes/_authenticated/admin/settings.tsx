import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

const FIELDS: { key: string; label: string; type?: "text" | "textarea" }[] = [
  { key: "store_name", label: "Store name" },
  { key: "store_tagline", label: "Store tagline" },
  { key: "announcement_text", label: "Announcement bar text" },
  { key: "contact_email", label: "Contact email" },
  { key: "contact_phone", label: "Contact phone" },
  { key: "contact_address", label: "Contact address", type: "textarea" },
  { key: "social_instagram", label: "Instagram URL" },
  { key: "social_facebook", label: "Facebook URL" },
  { key: "social_whatsapp", label: "WhatsApp URL" },
  { key: "currency_symbol", label: "Currency symbol (e.g. Rs.)" },
  { key: "shipping_flat_rate", label: "Shipping flat rate" },
  { key: "free_shipping_threshold", label: "Free shipping threshold" },
];

function SettingsAdmin() {
  const qc = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => (await supabase.from("settings").select("*")).data ?? [],
  });

  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => {
    const v: Record<string, string> = {};
    rows.forEach((r: any) => (v[r.key] = r.value ?? ""));
    setValues((prev) => ({ ...v, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.length]);

  const save = async () => {
    const upserts = FIELDS.map((f) => ({ key: f.key, value: values[f.key] ?? "" }));
    const { error } = await supabase.from("settings").upsert(upserts, { onConflict: "key" });
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["admin", "settings"] });
    qc.invalidateQueries({ queryKey: ["settings"] });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.type === "textarea" ? "md:col-span-2" : ""}>
            <Label>{f.label}</Label>
            {f.type === "textarea" ? (
              <Textarea
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
            ) : (
              <Input
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Button onClick={save}>Save settings</Button>
      </div>
    </div>
  );
}