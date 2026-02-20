import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";

const empty = { title: "", slug: "", content: "", excerpt: "", featured_image: "", status: "draft" as string, seo_title: "", seo_description: "" };

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(empty);

  const fetchData = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
  };
  useEffect(() => { fetchData(); }, []);

  const genSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      title: p.title, slug: p.slug, content: p.content || "", excerpt: p.excerpt || "",
      featured_image: p.featured_image || "", status: p.status,
      seo_title: p.seo_title || "", seo_description: p.seo_description || "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const slug = form.slug || genSlug(form.title);
    const payload: any = {
      title: form.title, slug, content: form.content, excerpt: form.excerpt || null,
      featured_image: form.featured_image || null, status: form.status,
      seo_title: form.seo_title || null, seo_description: form.seo_description || null,
      published_at: form.status === "published" ? new Date().toISOString() : null,
    };
    if (editing) {
      await supabase.from("blog_posts").update(payload).eq("id", editing.id);
    } else {
      payload.author_id = session?.user?.id;
      await supabase.from("blog_posts").insert(payload);
    }
    setOpen(false); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    fetchData();
  };

  const statusColor: Record<string, string> = { draft: "bg-muted text-muted-foreground", published: "bg-green-100 text-green-800", scheduled: "bg-blue-100 text-blue-800" };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button size="sm" onClick={() => { setEditing(null); setForm(empty); setOpen(true); }}><Plus className="h-4 w-4 mr-1" />New Post</Button>
      </div>
      <div className="rounded border bg-card">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Views</TableHead><TableHead>Date</TableHead><TableHead className="w-24">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {posts.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No posts</TableCell></TableRow>}
            {posts.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell><Badge className={statusColor[p.status] || ""}>{p.status}</Badge></TableCell>
                <TableCell><div className="flex items-center gap-1"><Eye className="h-3 w-3" />{p.view_count}</div></TableCell>
                <TableCell className="text-xs">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: genSlug(e.target.value) })} />
            <Input placeholder="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
            <Input placeholder="Featured Image URL" value={form.featured_image} onChange={e => setForm({ ...form, featured_image: e.target.value })} />
            <Input placeholder="Excerpt" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} />
            <Textarea placeholder="Content" rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
            <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="SEO Title" value={form.seo_title} onChange={e => setForm({ ...form, seo_title: e.target.value })} />
            <Textarea placeholder="SEO Description" value={form.seo_description} onChange={e => setForm({ ...form, seo_description: e.target.value })} rows={2} />
            <Button className="w-full" onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
