import Layout from "@/components/Layout";
import SEO, { generateOrganizationSchema, generateBreadcrumbSchema } from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { Link } from "react-router-dom";
import { Shield, Truck, RefreshCw, Users, Globe } from "lucide-react";

export default function About() {
  const stats = [
    { value: "9", label: "Categories" },
    { value: "500+", label: "Products" },
    { value: "12,000+", label: "Happy Customers" },
    { value: "20+", label: "Countries" },
  ];

  return (
    <Layout>
      <SEO 
        title="About Us"
        description="Junavo is your one-stop marketplace for quality products across 9 categories. Learn about our mission, values, and commitment to excellent service."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }} />
      <Breadcrumb items={[
        { name: "Home", url: "/" },
        { name: "About", url: "/about" }
      ]} />
      
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">About Junavo</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-4 rounded-2xl border bg-slate-50/50 dark:bg-slate-900/50">
              <strong className="text-3xl font-bold text-blue-600 block">{stat.value}</strong>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
        
        <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
          <p>Junavo is your one-stop marketplace for quality products across 9 categories. We believe shopping should be simple, fast, and enjoyable.</p>
          <p>Founded with the mission to make everyday essentials accessible and affordable, we curate products that meet our high standards for quality and value.</p>
          <p>From home and kitchen to electronics, sports, and beyond — we've got everything you need in one place.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 rounded-2xl border bg-white/50 dark:bg-slate-900/50">
            <Shield className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Our Mission</h3>
            <p className="text-sm text-muted-foreground">To provide quality products at fair prices with exceptional service.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-white/50 dark:bg-slate-900/50">
            <Truck className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">Quick shipping across Europe with real-time tracking.</p>
          </div>
          <div className="p-6 rounded-2xl border bg-white/50 dark:bg-slate-900/50">
            <Globe className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Global Reach</h3>
            <p className="text-sm text-muted-foreground">Serving customers in 20+ countries worldwide.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shop" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center">
            Explore Our Shop
          </Link>
          <Link to="/contact" className="px-6 py-3 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-center">
            Get in Touch
          </Link>
          <Link to="/blog" className="px-6 py-3 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-center">
            Read Our Blog
          </Link>
        </div>
      </div>
    </Layout>
  );
}
