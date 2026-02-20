import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4">Terms & Conditions</h1>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>By using Junavo, you agree to these terms and conditions. Please read them carefully.</p>
          <h2 className="text-base font-semibold text-foreground">Use of Service</h2>
          <p>You must be at least 18 years old to use our service. You are responsible for maintaining the confidentiality of your account.</p>
          <h2 className="text-base font-semibold text-foreground">Orders & Payments</h2>
          <p>All orders are subject to availability. Prices are listed in USD and may change without notice. Payment is required at the time of order.</p>
          <h2 className="text-base font-semibold text-foreground">Shipping</h2>
          <p>We aim to deliver within 3-7 business days. Shipping times may vary based on location and product availability.</p>
          <h2 className="text-base font-semibold text-foreground">Limitation of Liability</h2>
          <p>Junavo is not liable for any indirect, incidental, or consequential damages arising from the use of our service.</p>
        </div>
      </div>
    </Layout>
  );
}
