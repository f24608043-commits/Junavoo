import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategoryBySlug, getProducts, type Category, type Product } from "@/lib/api/shop.functions";
import { ArrowLeft, ArrowRight, FolderOpen } from "lucide-react";

export const Route = createFileRoute("/categories/$slug")({
  head: () => ({ meta: [{ title: "Category — My Store" }] }),
  component: CategoryDetail,
});

function CategoryDetail() {
  const { slug } = Route.useParams();

  const { data: category } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => getCategoryBySlug({ data: { slug } }),
  });

  const { data: products } = useQuery({
    queryKey: ["products", category?.id],
    queryFn: () => getProducts({ data: { category_id: category?.id } }),
    enabled: !!category?.id,
  });

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Category not found</h3>
          <Link to="/categories">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Banner */}
      {category.hero_banner_image_url && (
        <div className="relative h-64 md:h-80">
          <img
            src={category.hero_banner_image_url}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-lg text-slate-200 max-w-2xl mx-auto">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link to="/categories" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Subcategories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {category.children.map((child) => (
                <Link key={child.id} to="/categories/$slug" params={{ slug: child.slug }}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold">{child.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {products?.length || 0} {products?.length === 1 ? "Product" : "Products"}
            </h2>
            <Link to="/shop">
              <Button variant="outline" size="sm">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">No products in this category</h3>
              <p className="text-muted-foreground mb-4">
                Check back later or browse other categories
              </p>
              <Link to="/categories">
                <Button variant="outline">
                  Browse Other Categories
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <Link to="/products/$slug" params={{ slug: product.slug }}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="aspect-square bg-slate-100 rounded-md mb-4 overflow-hidden relative">
            {product.image_url_1 ? (
              <img
                src={product.image_url_1}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <span className="text-4xl">📦</span>
              </div>
            )}
            {discount > 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
                {discount}% OFF
              </Badge>
            )}
          </div>
          <h3 className="font-semibold line-clamp-2 mb-2 min-h-[2.5rem]">{product.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>
          {product.brand && (
            <Badge variant="outline" className="text-xs">
              {product.brand.name}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
