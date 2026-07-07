import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderConfirmation() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Order Confirmed!</h1>
        <p className="text-sm text-muted-foreground mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
        <div className="flex gap-3 justify-center">
          <Button asChild><Link to="/shop">Continue Shopping</Link></Button>
          <Button variant="outline" asChild><Link to="/account">My Orders</Link></Button>
        </div>
      </div>
    </Layout>
  );
}
