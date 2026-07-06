import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { getProductBySlug, getProducts, type Product } from "@/lib/api/shop.functions";
import { ArrowLeft, ShoppingCart, Star, Package, Truck, Shield, Check, Plus, Minus, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/products/$slug")({
  head: () => ({ meta: [{ title: "Product — My Store" }] }),
  component: ProductDetail,
});

function ProductDetail() {
  const { slug } = Route.useParams();
  const [quantity, setQuantity] = useState(1);

  const { data: product } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug({ data: { slug } }),
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["related-products", product?.category_id],
    queryFn: () => getProducts({ data: { category_id: product?.category_id || undefined, limit: 4 } }),
    enabled: !!product?.category_id,
  });

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Product not found</h3>
          <Link to="/shop">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              {product.image_url_1 ? (
                <img
                  src={product.image_url_1}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <Package className="h-24 w-24" />
                </div>
              )}
            </div>
            {product.image_url_2 && (
              <div className="aspect-square bg-white rounded-lg overflow-hidden">
                <img
                  src={product.image_url_2}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {product.image_url_3 && (
              <div className="aspect-square bg-white rounded-lg overflow-hidden">
                <img
                  src={product.image_url_3}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {product.category && (
              <Link to="/categories/$slug" params={{ slug: product.category.slug }}>
                <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
                  {product.category.name}
                </Badge>
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>

            {product.description && (
              <p className="text-muted-foreground text-lg">{product.description}</p>
            )}

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                  {discount > 0 && (
                    <Badge variant="destructive" className="text-sm">
                      {discount}% OFF
                    </Badge>
                  )}
                </>
              )}
            </div>

            {product.brand && (
              <div className="text-sm text-muted-foreground">
                Brand: <span className="font-semibold text-foreground">{product.brand.name}</span>
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-5 w-5 text-green-600" />
                <span>In Stock ({product.stock} available)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-5 w-5" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-5 w-5" />
                <span>Secure payment guaranteed</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1" onClick={() => alert(`Added ${quantity} items to cart`)}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={() => alert(`Buy Now: ${quantity} items`)}>
                <ShoppingBag className="mr-2 h-5 w-5" />
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 1 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
            </div>
          </section>
        )}
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
