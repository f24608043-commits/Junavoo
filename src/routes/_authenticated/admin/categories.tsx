import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/slug";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: CategoriesAdmin,
});

type Cat = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hero_banner_image_url: string | null;
  parent_id: string | null;
};

type Draft = Omit<Cat, "id"> & { id?: string };

const empty: Draft = {
  name: "",
  slug: "",
  description: "",
  hero_banner_image_url: "",
  parent_id: null,
};

function CategoriesAdmin() {
  const qc = useQueryClient();
  const { data: cats = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data as Cat[];
    },
  });

  const [draft, setDraft] = useState<Draft | null>(null);

  const save = async () => {
    if (!draft) return;
    const name = draft.name.trim();
    if (!name) return toast.error("Name required");
    const row = {
      name,
      slug: (draft.slug || slugify(name)).trim(),
      description: draft.description || null,
      hero_banner_image_url: draft.hero_banner_image_url || null,
      parent_id: draft.parent_id || null,
    };
    const { error } = draft.id
      ? await supabase.from("categories").update(row).eq("id", draft.id)
      : await supabase.from("categories").insert(row);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setDraft(null);
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
  };

  // Render tree
  const roots = cats.filter((c) => !c.parent_id);
  const childrenOf = (id: string) => cats.filter((c) => c.parent_id === id);

  const renderNode = (c: Cat, depth = 0): React.ReactNode => (
    <li key={c.id} style={{ marginLeft: depth * 16 }} className="py-1">
      <span className="font-medium">{c.name}</span>{" "}
      <span className="text-xs text-muted-foreground">/{c.slug}</span>
      <button className="ml-3 text-xs underline" onClick={() => setDraft({ ...c })}>Edit</button>
      <button className="ml-2 text-xs text-destructive underline" onClick={() => del(c.id)}>Delete</button>
      {childrenOf(c.id).length > 0 && (
        <ul>{childrenOf(c.id).map((ch) => renderNode(ch, depth + 1))}</ul>
      )}
    </li>
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Button onClick={() => setDraft({ ...empty })}>New category</Button>
      </div>

      {draft && (
        <div className="mt-4 space-y-3 rounded border border-border p-4">
          <div>
            <Label>Name</Label>
            <Input
              value={draft.name}
              onChange={(e) =>
                setDraft({ ...draft, name: e.target.value, slug: draft.slug || slugify(e.target.value) })
              }
            />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={draft.description ?? ""}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Hero banner image URL</Label>
            <Input
              value={draft.hero_banner_image_url ?? ""}
              onChange={(e) => setDraft({ ...draft, hero_banner_image_url: e.target.value })}
            />
          </div>
          <div>
            <Label>Parent category</Label>
            <select
              className="block w-full rounded border border-input bg-background p-2 text-sm"
              value={draft.parent_id ?? ""}
              onChange={(e) => setDraft({ ...draft, parent_id: e.target.value || null })}
            >
              <option value="">— None (top-level) —</option>
              {cats
                .filter((c) => c.id !== draft.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <ul className="mt-6 text-sm">
        {roots.length === 0 && <li className="text-muted-foreground">No categories yet.</li>}
        {roots.map((c) => renderNode(c))}
      </ul>
    </div>
  );
}