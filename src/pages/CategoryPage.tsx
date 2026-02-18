import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/constants";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const category = CATEGORIES.find(c => c.slug === slug);

  // Fetch products for this category from database
  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    const fetchCategoryProducts = async () => {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .eq('category_id', category.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching category products:', error);
        setError('Failed to load products');
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchCategoryProducts();

    // Set up real-time subscription for this category
    const subscription = supabase
      .channel('products-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          console.log('Product change:', payload);
          fetchCategoryProducts(); // Refetch on any change
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [slug, category]);

  if (!category) {
    return <Layout><div className="container mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-semibold mb-2">Category Not Found</h1><Link to="/shop" className="text-primary hover:underline text-sm">Browse all products</Link></div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">{category.name}</h1>
        {products.length === 0 ? (
          <p className="text-muted-foreground">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </Layout>
  );
}
