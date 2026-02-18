import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4">About Junavo</h1>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>Junavo is your one-stop marketplace for quality products across 12 categories. We believe shopping should be simple, fast, and enjoyable.</p>
          <p>Founded with the mission to make everyday essentials accessible and affordable, we curate products that meet our high standards for quality and value.</p>
          <p>From home and kitchen to electronics, sports, and beyond — we've got everything you need in one place.</p>
          <h2 className="text-lg font-semibold text-foreground pt-4">Our Promise</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Quality products at fair prices</li>
            <li>Free shipping on orders over $50</li>
            <li>Easy returns and refunds</li>
            <li>Responsive customer support</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
