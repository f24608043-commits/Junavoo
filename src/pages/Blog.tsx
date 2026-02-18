import { useEffect, useState, useRef } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type BlogPost = {
  id: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  slug: string;
  published_at: string | null;
  status: string;
  author_id: string;
};

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLocale();

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id, title, excerpt, featured_image, slug, published_at, status, author_id")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setPosts(data || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".blog-card");
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 85%" },
        }
      );
    }
  }, [loading]);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.querySelectorAll(".hero-el"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" }
      );
    }
  }, []);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <Layout>
      {/* Hero */}
      <section ref={heroRef} className="bg-muted/40 border-b">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="hero-el inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
            {language === "it" ? "Il Nostro Blog" : "Our Blog"}
          </div>
          <h1 className="hero-el text-4xl md:text-6xl font-bold tracking-tight max-w-2xl mb-4">
            {t("latestBlogs")}
          </h1>
          <p className="hero-el text-muted-foreground max-w-lg text-lg">
            {language === "it"
              ? "Consigli, notizie e aggiornamenti dal team Junavo."
              : "Tips, news and updates from the Junavo team."}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted animate-pulse h-72" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            {language === "it" ? "Nessun articolo ancora." : "No articles yet. Check back soon!"}
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <Link to={`/blog/${featured.slug}`} className="group block mb-12">
                <div className="grid md:grid-cols-2 gap-8 rounded-2xl overflow-hidden border bg-card hover:shadow-xl transition-all duration-500">
                  <div className="aspect-video md:aspect-auto bg-muted overflow-hidden">
                    {featured.featured_image ? (
                      <img
                        src={featured.featured_image}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center min-h-[240px]">
                        <span className="text-4xl font-bold text-primary/30">J</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-4 w-fit">
                      {language === "it" ? "In Evidenza" : "Featured"}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-3">{featured.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                      {featured.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(featured.published_at).toLocaleDateString(language === "it" ? "it-IT" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                      {t("readMore")} <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div ref={gridRef} className="grid md:grid-cols-3 gap-6">
                {rest.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="blog-card group block">
                    <article className="rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-400 h-full flex flex-col">
                      <div className="aspect-video bg-muted overflow-hidden flex-shrink-0">
                        {post.featured_image ? (
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <span className="text-3xl font-bold text-primary/30">J</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          {post.published_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.published_at).toLocaleDateString(language === "it" ? "it-IT" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-1">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                        )}
                        <span className="flex items-center gap-1 text-xs font-semibold text-primary mt-auto group-hover:gap-2 transition-all">
                          {t("readMore")} <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
