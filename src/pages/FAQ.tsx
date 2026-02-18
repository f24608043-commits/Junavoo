import Layout from "@/components/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How do I place an order?", a: "Browse products, add items to your cart, and proceed to checkout. Fill in your details and place your order." },
  { q: "What payment methods do you accept?", a: "We currently accept Cash on Delivery. Card payment options are coming soon." },
  { q: "How long does shipping take?", a: "Standard shipping takes 3-7 business days depending on your location." },
  { q: "Is there free shipping?", a: "Yes! Orders over $50 qualify for free shipping." },
  { q: "How do I return a product?", a: "Contact our support team within 7 days of delivery to initiate a return." },
  { q: "How can I track my order?", a: "Log into your account and check the Orders section for real-time status updates." },
];

export default function FAQ() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible>
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger className="text-sm text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Layout>
  );
}
