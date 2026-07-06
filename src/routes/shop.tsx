import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProducts, getCategories, getBrands, type Product, type Category, type Brand } from "@/lib/api/shop.functions";
import { Search, SlidersHorizontal, Heart, Eye, Star, ArrowLeft, Grid, List, ArrowRight, ShoppingCart } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({ 
    meta: [
      { title: "Shop — My Store" },
      { name: "description", content: "Browse all products at My Store" },
    ] 
  }),
  component: Shop,
});

function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: products } = useQuery({
    queryKey: ["products", searchQuery, selectedCategory, selectedBrand, priceRange],
    queryFn: () => getProducts({
      data: {
        search: searchQuery || undefined,
        category_id: selectedCategory || undefined,
        brand_id: selectedBrand || undefined,
      },
    }),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ data: { parent_id: null } }),
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrands(),
  });

  const filteredAndSortedProducts = (() => {
    let result = products || [];

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "name-asc") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  })();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <span className="text-foreground">Shop</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">Discover our complete collection</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </h3>

              {/* Search */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brands */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">Brand</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Brands</SelectItem>
                    {brands?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-2 block">
                  Price Range (${priceRange[0]} - ${priceRange[1]})
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-24"
                    min={0}
                    max={1000}
                  />
                  <span className="self-center">-</span>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                    className="w-24"
                    min={0}
                    max={1000}
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedCategory || selectedBrand || priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setSelectedBrand("");
                    setPriceRange([0, 1000]);
                  }}
                  className="w-full"
                >
                  Clear All
                </Button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? "product" : "products"} found
              </p>
              
              <div className="flex items-center gap-3">
                {/* View Mode */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredAndSortedProducts.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductListItem key={product.id} product={product} />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16 bg-white rounded-lg">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setSelectedBrand("");
                    setPriceRange([0, 1000]);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
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
        <Button size="sm" className="flex-1" onClick={() => alert(`Added ${product.name} to cart`)}>
          <ShoppingCart className="h-4 w-4 mr-1" />
          Add
        </Button>
        <Link to="/products/$slug" params={{ slug: product.slug }} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function ProductListItem({ product }: { product: Product }) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <Card className="flex flex-col sm:flex-row hover:shadow-md transition-shadow">
      <div className="relative w-full sm:w-48 aspect-square">
        {product.image_url_1 ? (
          <img
            src={product.image_url_1}
            alt={product.name}
            className="w-full h-full object-cover rounded-l-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span className="text-4xl">📦</span>
          </div>
        )}
        {discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            {discount}% OFF
          </Badge>
        )}
      </div>
      
      <CardContent className="flex-1 p-4">
        <div className="flex flex-col h-full justify-between">
          <div>
            {product.category && (
              <Badge variant="outline" className="text-xs mb-2">
                {product.category.name}
              </Badge>
            )}
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            {product.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {product.description}
              </p>
            )}
          </div>
          
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Link to="/products/$slug" params={{ slug: product.slug }}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
              <Button size="sm">
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}