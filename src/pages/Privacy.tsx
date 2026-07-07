import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-4">Privacy Policy</h1>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>At Junavo, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
          <h2 className="text-base font-semibold text-foreground">Information We Collect</h2>
          <p>We collect information you provide during registration, checkout, and contact form submissions, including name, email, phone, and shipping address.</p>
          <h2 className="text-base font-semibold text-foreground">How We Use Your Information</h2>
          <p>Your information is used to process orders, provide customer support, and improve our services. We never sell your data to third parties.</p>
          <h2 className="text-base font-semibold text-foreground">Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information from unauthorized access.</p>
          <h2 className="text-base font-semibold text-foreground">Contact</h2>
          <p>For privacy-related inquiries, contact us at support@junavo.com.</p>
        </div>
      </div>
    </Layout>
  );
}
