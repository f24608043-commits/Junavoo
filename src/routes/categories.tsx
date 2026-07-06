import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCategories, type Category } from "@/lib/api/shop.functions";
import { ArrowRight, FolderOpen } from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "Categories — My Store" }] }),
  component: Categories,
});

function Categories() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ data: { parent_id: null } }),
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground">Browse our products by category</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No categories yet</h3>
            <p className="text-muted-foreground">
              Categories will appear here once they're added by the admin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link to="/categories/$slug" params={{ slug: category.slug }}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-6">
          {category.hero_banner_image_url ? (
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-4">
              <img
                src={category.hero_banner_image_url}
                alt={category.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-4 flex items-center justify-center">
              <FolderOpen className="h-12 w-12 text-slate-400" />
            </div>
          )}
          <h3 className="text-xl font-bold mb-2">{category.name}</h3>
          {category.description && (
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {category.description}
            </p>
          )}
          {category.children && category.children.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {category.children.slice(0, 3).map((child) => (
                <Badge key={child.id} variant="secondary" className="text-xs">
                  {child.name}
                </Badge>
              ))}
              {category.children.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{category.children.length - 3} more
                </Badge>
              )}
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            Browse <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
