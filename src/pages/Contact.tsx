import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <Layout>
      <SEO 
        title="Contact Us"
        description="Have questions? Contact Junavo for support. We're here to help with orders, products, and general inquiries. Check our FAQ for quick answers."
      />
      <Breadcrumb items={[
        { name: "Home", url: "/" },
        { name: "Contact", url: "/contact" }
      ]} />
      
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground mb-6">
              Have questions? We're here to help. Before reaching out, check our <Link to="/faq" className="text-blue-600 hover:underline">FAQ page</Link> for quick answers.
            </p>
            
            {sent ? (
              <p className="text-sm text-primary">Thank you! We'll get back to you soon.</p>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <div><Label className="text-xs">Name</Label><Input required className="h-9" /></div>
                <div><Label className="text-xs">Email</Label><Input type="email" required className="h-9" /></div>
                <div><Label className="text-xs">Message</Label><Textarea required rows={4} /></div>
                <Button type="submit">Send Message</Button>
              </form>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📧 support@junavo.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>🕒 Mon-Fri: 9AM-6PM UTC</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <Link to="/faq" className="text-sm text-blue-600 hover:underline">FAQ - Check here first</Link>
                <Link to="/refund" className="text-sm text-blue-600 hover:underline">Return Policy</Link>
                <Link to="/shipping" className="text-sm text-blue-600 hover:underline">Shipping Information</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
