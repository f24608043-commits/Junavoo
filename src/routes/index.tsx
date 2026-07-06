import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProducts, getCategories, getDeals, getSettings, getBlogPosts, type Product, type Category, type Deal, type BlogPost } from "@/lib/api/shop.functions";
import { ShoppingCart, Star, ArrowRight, Heart, Eye, Clock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Store — Quality products, delivered." },
      { name: "description", content: "Shop quality products at My Store. Fast checkout, no account required." },
      { property: "og:title", content: "My Store" },
      { property: "og:description", content: "Quality products, delivered." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: () => getSettings(),
  });

  const { data: featuredProducts } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => getProducts({ data: { featured: true, limit: 8 } }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ data: { parent_id: null } }),
  });

  const { data: deals } = useQuery({
    queryKey: ["deals"],
    queryFn: () => getDeals({ data: { active: true, limit: 3 } }),
  });

  const { data: blogPosts } = useQuery({
    queryKey: ["blog-posts-home"],
    queryFn: () => getBlogPosts({ data: { limit: 3 } }),
  });

  const siteName = settings?.site_name || "My Store";
  const siteTagline = settings?.site_tagline || "Quality products, delivered.";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300508-c3b1ddc11b68?w=1920')] bg-cover bg-center opacity-20"></div>
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{siteName}</h1>
            <p className="text-xl text-slate-300 mb-8">{siteTagline}</p>
            <div className="flex gap-4">
              <Link to="/shop">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {categories && categories.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Shop by Category</h2>
              <Link to="/categories">
                <Button variant="ghost">View All Categories</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.slice(0, 6).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Special Offers Banner */}
      {deals && deals.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-amber-900 flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Special Offers
              </h2>
              <Badge variant="secondary" className="bg-amber-600 text-white">
                Limited Time
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 px-4 bg-slate-50">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <Link to="/shop">
                <Button variant="outline">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Blog Posts */}
      {blogPosts && blogPosts.length > 0 && (
        <section className="py-16 px-4 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Latest From Our Blog</h2>
              <Link to="/blog">
                <Button variant="ghost">View All Posts</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-slate-300 mb-8">
            Subscribe to our newsletter for exclusive deals and new arrivals
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400"
            />
            <Button className="bg-white text-slate-900 hover:bg-slate-100">
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full bg-white">
      <CardContent className="p-0">
        <div className="relative aspect-square bg-slate-100 rounded-t-lg overflow-hidden">
          {product.image_url_1 ? (
            <img
              src={product.image_url_1}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <span className="text-5xl">📦</span>
            </div>
          )}
          
          {/* Overlay buttons */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <Button size="sm" variant="secondary" className="h-9 w-9 p-0 rounded-full">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="h-9 w-9 p-0 rounded-full">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
              {discount}% OFF
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          {product.category && (
            <Badge variant="outline" className="text-xs mb-2">
              {product.category.name}
            </Badge>
          )}
          <h3 className="font-semibold line-clamp-2 mb-2 min-h-[2.5rem]">{product.name}</h3>
          
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">(0)</span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="flex-1" onClick={() => alert(`Added ${product.name} to cart`)}>
          <ShoppingCart className="h-4 w-4 mr-1" />
          Add
        </Button>
        <Link to="/products/$slug" params={{ slug: product.slug }} className="flex-1">
          <Button variant="outline" className="w-full">
            View
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link to="/categories/$slug" params={{ slug: category.slug }}>
      <Card className="group hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
          {category.hero_banner_image_url ? (
            <img
              src={category.hero_banner_image_url}
              alt={category.name}
              className="w-full h-32 object-cover rounded-md mb-4"
            />
          ) : (
            <div className="w-full h-32 bg-slate-100 rounded-md mb-4 flex items-center justify-center">
              <span className="text-4xl">📦</span>
            </div>
          )}
          <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {category.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  return (
    <Card className="border-amber-200 bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <Badge className="bg-amber-600 text-white mb-4">Special Deal</Badge>
        <h3 className="text-xl font-bold mb-2">{deal.title}</h3>
        {deal.description && (
          <p className="text-muted-foreground mb-4">{deal.description}</p>
        )}
        <div className="text-3xl font-bold text-amber-600 mb-4">
          ${deal.deal_price.toFixed(2)}
        </div>
        {deal.expires_at && (
          <p className="text-sm text-muted-foreground">
            Expires: {new Date(deal.expires_at).toLocaleDateString()}
          </p>
        )}
        {deal.products && deal.products.length > 0 && (
          <div className="mt-4 pt-4 border-t border-amber-200">
            <p className="text-sm font-semibold mb-2">Includes:</p>
            <div className="space-y-2">
              {deal.products.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center gap-2 text-sm">
                  {product.image_url_1 && (
                    <img
                      src={product.image_url_1}
                      alt={product.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                  <span className="line-clamp-1">{product.name}</span>
                </div>
              ))}
              {deal.products.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{deal.products.length - 3} more items
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link to="/shop" className="w-full">
          <Button className="w-full">
            View Deal
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }}>
      <Card className="group hover:shadow-lg transition-shadow cursor-pointer h-full">
        {post.cover_image_url && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
            <span>{Math.ceil(post.content.length / 500)} min read</span>
          </div>
          <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
          {post.excerpt && (
            <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
          )}
          <div className="flex items-center text-sm font-semibold text-primary">
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}