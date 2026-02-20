import Layout from "@/components/Layout";

export default function Refund() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4">Refund Policy</h1>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>We want you to be completely satisfied with your purchase. If you're not, here's how our refund process works.</p>
          <h2 className="text-base font-semibold text-foreground">Eligibility</h2>
          <p>Items must be returned within 7 days of delivery in their original condition and packaging.</p>
          <h2 className="text-base font-semibold text-foreground">Process</h2>
          <p>Contact our support team at support@junavo.com to initiate a return. Once approved, you'll receive shipping instructions.</p>
          <h2 className="text-base font-semibold text-foreground">Refund Timeline</h2>
          <p>Refunds are processed within 5-10 business days after we receive the returned item.</p>
          <h2 className="text-base font-semibold text-foreground">Non-Refundable Items</h2>
          <p>Cosmetics, baby products, and items marked as final sale are non-refundable.</p>
        </div>
      </div>
    </Layout>
  );
}
