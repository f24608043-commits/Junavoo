import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBlogPostBySlug, getBlogPosts, type BlogPost } from "@/lib/api/shop.functions";
import { ArrowLeft, Calendar, Clock, Share2, FileText } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  head: () => ({ meta: [{ title: "Blog Post — My Store" }] }),
  component: BlogPostDetail,
});

function BlogPostDetail() {
  const { slug } = Route.useParams();

  const { data: post } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => getBlogPostBySlug({ data: { slug } }),
  });

  const { data: recentPosts } = useQuery({
    queryKey: ["recent-blog-posts"],
    queryFn: () => getBlogPosts({ data: { limit: 3 } }),
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Blog post not found</h3>
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="relative h-64 md:h-96">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{Math.ceil(post.content.length / 500)} min read</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6">{post.title}</h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8">{post.excerpt}</p>
          )}

          <Separator className="mb-8" />

          {/* Article Content */}
          <div className="prose prose-slate max-w-none">
            <div className="whitespace-pre-wrap">{post.content}</div>
          </div>

          <Separator className="my-8" />

          {/* Share Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Share this article</span>
            </div>
            <Button variant="outline" size="sm">
              Copy Link
            </Button>
          </div>
        </article>

        {/* Recent Posts */}
        {recentPosts && recentPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts
                .filter((p) => p.id !== post.id)
                .slice(0, 3)
                .map((recentPost) => (
                  <BlogCard key={recentPost.id} post={recentPost} />
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        {post.cover_image_url && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2 line-clamp-2">{post.title}</h3>
          {post.excerpt && (
            <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">{post.excerpt}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
