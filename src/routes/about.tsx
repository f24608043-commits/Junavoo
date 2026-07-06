import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Truck, Users, Target, Award, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About Us — My Store" }] }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20 px-4">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-5xl font-bold mb-4">About My Store</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your trusted destination for quality products since 2020
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Founded in 2020, My Store started with a simple mission: to provide quality products at fair prices with exceptional customer service. What began as a small operation has grown into a trusted online destination for shoppers worldwide.
              </p>
              <p className="text-muted-foreground mb-6">
                We believe that shopping should be easy, enjoyable, and accessible to everyone. That's why we've curated a selection of products that meet our high standards for quality, value, and sustainability.
              </p>
              <Link to="/shop">
                <Button>
                  Shop Our Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-slate-100 rounded-lg aspect-video flex items-center justify-center">
              <span className="text-6xl">🏪</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-6">
                <Heart className="h-12 w-12 mx-auto mb-4 text-red-500" />
                <h3 className="font-semibold text-lg mb-2">Customer First</h3>
                <p className="text-sm text-muted-foreground">
                  Your satisfaction is our top priority. We go above and beyond to ensure you're happy with your purchase.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold text-lg mb-2">Quality Assurance</h3>
                <p className="text-sm text-muted-foreground">
                  Every product is carefully selected and inspected to meet our rigorous quality standards.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Truck className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  We partner with reliable shipping services to ensure your orders arrive quickly and safely.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                <h3 className="font-semibold text-lg mb-2">Community Focus</h3>
                <p className="text-sm text-muted-foreground">
                  We support local communities and sustainable practices in everything we do.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-slate-100 rounded-lg aspect-video flex items-center justify-center order-2 md:order-1">
              <span className="text-6xl">🎯</span>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                To be the most trusted and customer-centric online retailer, providing an exceptional shopping experience that combines quality products, competitive prices, and outstanding service.
              </p>
              <p className="text-muted-foreground mb-6">
                We're committed to continuous improvement, innovation, and building lasting relationships with our customers and partners.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="font-medium">Quality Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span className="font-medium">Best Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-slate-300">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-slate-300">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-slate-300">Brands</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5+</div>
              <div className="text-slate-300">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
          <p className="text-muted-foreground mb-8">
            Discover our amazing collection of products and experience the My Store difference today.
          </p>
          <Link to="/shop">
            <Button size="lg">
              Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
