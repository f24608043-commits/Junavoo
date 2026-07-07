import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

type BlogPost = {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  slug: string;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLocale();

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single()
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <Layout><div className="container mx-auto px-6 py-24 text-center text-muted-foreground">Loading...</div></Layout>;
  if (!post) return <Layout><div className="container mx-auto px-6 py-24 text-center"><h1 className="text-2xl font-bold mb-4">{language === "it" ? "Articolo non trovato" : "Post not found"}</h1><Link to="/blog" className="text-primary hover:underline">← {language === "it" ? "Torna al Blog" : "Back to Blog"}</Link></div></Layout>;

  return (
    <Layout>
      {post.featured_image && (
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          {language === "it" ? "Tutti gli Articoli" : "All Articles"}
        </Link>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{post.title}</h1>
        {post.published_at && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Calendar className="h-4 w-4" />
            {new Date(post.published_at).toLocaleDateString(language === "it" ? "it-IT" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        )}
        {post.excerpt && (
          <p className="text-lg text-muted-foreground mb-8 pb-8 border-b leading-relaxed">{post.excerpt}</p>
        )}
        {post.content && (
          <div className="prose prose-neutral max-w-none text-foreground leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }}
          />
        )}
      </div>
    </Layout>
  );
}
