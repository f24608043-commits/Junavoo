import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type SettingsMap = Record<string, any>;

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*");
    const map: SettingsMap = {};
    (data || []).forEach(s => { map[s.key] = s.value; });
    setSettings(map);
  };

  useEffect(() => { fetchSettings(); }, []);

  const saveSetting = async (key: string, value: any, category: string) => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from("site_settings").upsert(
      { key, value, category, updated_by: session?.user?.id },
      { onConflict: "key" }
    );
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: `${key} updated successfully` });
    }
    setLoading(false);
  };

  const get = (key: string, def: any = "") => settings[key] ?? def;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">General Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Site Name</label>
                <Input value={get("site_name", "Junavo")} onChange={e => setSettings({ ...settings, site_name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Contact Email</label>
                <Input value={get("contact_email")} onChange={e => setSettings({ ...settings, contact_email: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Support Phone</label>
                <Input value={get("support_phone")} onChange={e => setSettings({ ...settings, support_phone: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Currency</label>
                <Input value={get("currency", "USD")} onChange={e => setSettings({ ...settings, currency: e.target.value })} />
              </div>
              <Button disabled={loading} onClick={() => {
                saveSetting("site_name", settings.site_name || "Junavo", "general");
                saveSetting("contact_email", settings.contact_email || "", "general");
                saveSetting("support_phone", settings.support_phone || "", "general");
                saveSetting("currency", settings.currency || "USD", "general");
              }}>Save General Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Shipping Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Flat Shipping Rate ($)</label>
                <Input type="number" step="0.01" value={get("shipping_rate", 0)} onChange={e => setSettings({ ...settings, shipping_rate: +e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Free Shipping Threshold ($)</label>
                <Input type="number" step="0.01" value={get("free_shipping_threshold", 0)} onChange={e => setSettings({ ...settings, free_shipping_threshold: +e.target.value })} />
              </div>
              <Button disabled={loading} onClick={() => {
                saveSetting("shipping_rate", settings.shipping_rate || 0, "shipping");
                saveSetting("free_shipping_threshold", settings.free_shipping_threshold || 0, "shipping");
              }}>Save Shipping Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">SEO Defaults</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Default Meta Title</label>
                <Input value={get("default_meta_title")} onChange={e => setSettings({ ...settings, default_meta_title: e.target.value })} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Default Meta Description</label>
                <Textarea value={get("default_meta_description")} onChange={e => setSettings({ ...settings, default_meta_description: e.target.value })} />
              </div>
              <Button disabled={loading} onClick={() => {
                saveSetting("default_meta_title", settings.default_meta_title || "", "seo");
                saveSetting("default_meta_description", settings.default_meta_description || "", "seo");
              }}>Save SEO Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
