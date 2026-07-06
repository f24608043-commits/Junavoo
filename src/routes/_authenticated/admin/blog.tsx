import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { slugify } from "@/lib/slug";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: BlogAdmin,
});

type Draft = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  published: boolean;
};

const empty: Draft = { title: "", slug: "", excerpt: "", content: "", cover_image_url: "", published: false };

function BlogAdmin() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);

  const { data: posts = [] } = useQuery({
    queryKey: ["admin", "blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = async () => {
    if (!draft) return;
    const title = draft.title.trim();
    if (!title) return toast.error("Title required");
    if (!draft.content.trim()) return toast.error("Content required");
    const row = {
      title,
      slug: (draft.slug || slugify(title)).trim(),
      excerpt: draft.excerpt || null,
      content: draft.content,
      cover_image_url: draft.cover_image_url || null,
      published: draft.published,
    };
    const { error } = draft.id
      ? await supabase.from("blog_posts").update(row).eq("id", draft.id)
      : await supabase.from("blog_posts").insert(row);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setDraft(null);
    qc.invalidateQueries({ queryKey: ["admin", "blog"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "blog"] });
  };

  const startEdit = (p: any) =>
    setDraft({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt ?? "",
      content: p.content,
      cover_image_url: p.cover_image_url ?? "",
      published: p.published,
    });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <Button onClick={() => setDraft({ ...empty })}>New post</Button>
      </div>

      {draft && (
        <div className="mt-4 grid grid-cols-1 gap-3 rounded border border-border p-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Title</Label>
            <Input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: draft.slug || slugify(e.target.value) })}
            />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
          </div>
          <div>
            <Label>Cover image URL</Label>
            <Input value={draft.cover_image_url} onChange={(e) => setDraft({ ...draft, cover_image_url: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Excerpt</Label>
            <Textarea rows={2} value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <Label>Content (markdown)</Label>
            <Textarea rows={12} value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={draft.published} onCheckedChange={(v) => setDraft({ ...draft, published: v })} />
            <Label>Published</Label>
          </div>
          <div className="flex gap-2 md:col-span-2">
            <Button onClick={save}>Save</Button>
            <Button variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2">Title</th>
            <th>Slug</th>
            <th>Status</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 && <tr><td colSpan={5} className="py-3 text-muted-foreground">No posts.</td></tr>}
          {posts.map((p: any) => (
            <tr key={p.id} className="border-b border-border">
              <td className="py-2">{p.title}</td>
              <td className="font-mono text-xs">{p.slug}</td>
              <td>{p.published ? "Published" : "Draft"}</td>
              <td>{new Date(p.created_at).toLocaleDateString()}</td>
              <td className="text-right">
                <button className="mr-3 underline" onClick={() => startEdit(p)}>Edit</button>
                <button className="text-destructive underline" onClick={() => del(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}