import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>
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
        <div className="mt-8 text-sm text-muted-foreground space-y-1">
          <p>📧 support@junavo.com</p>
          <p>📞 +1 (555) 123-4567</p>
        </div>
      </div>
    </Layout>
  );
}
