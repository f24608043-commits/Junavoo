import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { Link } from "react-router-dom";
import { Calendar, ArrowLeft, Clock } from "lucide-react";

export default function BlogKitchenEssentials() {
  return (
    <Layout>
      <SEO 
        title="10 Kitchen Essentials Every Home Needs | Junavoo"
        description="Discover the must-have kitchen tools and appliances that every modern home needs for efficient cooking and meal preparation."
      />
      <Breadcrumb items={[
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: "10 Kitchen Essentials Every Home Needs", url: "/blog/kitchen-essentials" }
      ]} />
      
      {/* Hero Image */}
      <div className="w-full h-64 md:h-96 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=1080&fit=crop&q=75&auto=format"
          alt="Modern kitchen with essential tools"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          All Articles
        </Link>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4" />
          <span>June 12, 2026</span>
          <span className="mx-2">•</span>
          <Clock className="h-4 w-4" />
          <span>8 min read</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-6">10 Kitchen Essentials Every Home Needs</h1>

        <p className="text-lg text-muted-foreground mb-8 pb-8 border-b leading-relaxed">
          Every well-equipped kitchen needs certain essentials to make cooking efficient and enjoyable. 
          Here are the 10 kitchen essentials that every home should have for creating delicious meals with ease.
        </p>

        <div className="prose prose-neutral max-w-none text-foreground leading-relaxed space-y-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Chef's Knife</h2>
          <p>
            A high-quality chef's knife is the most important tool in any kitchen. Invest in one that feels 
            comfortable in your hand and stays sharp. A good 8-inch chef's knife can handle most cutting tasks 
            from chopping vegetables to slicing meat.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">2. Cutting Board</h2>
          <p>
            A durable cutting board is essential for food preparation. Choose wooden or plastic boards that 
            are easy to clean and maintain. Having multiple boards for different food types helps prevent 
            cross-contamination.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">3. Non-Stick Skillet</h2>
          <p>
            Perfect for eggs, pancakes, and delicate foods. A good 10-12 inch non-stick skillet is versatile 
            and easy to clean. Look for one with a heavy bottom for even heat distribution.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">4. Stockpot</h2>
          <p>
            A large stockpot (6-8 quarts) is essential for making soups, stews, and boiling pasta. Look 
            for one with a heavy bottom for even heating and a lid that fits tightly.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">5. Measuring Cups and Spoons</h2>
          <p>
            Accurate measuring is crucial for baking and cooking. Get both dry and liquid measuring cups 
            for precise measurements. Stainless steel measuring cups are durable and won't absorb odors.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">6. Mixing Bowls</h2>
          <p>
            A set of mixing bowls in various sizes (small, medium, large) will cover most cooking needs. 
            Stainless steel or glass bowls are ideal as they don't retain odors and are easy to clean.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">7. Blender</h2>
          <p>
            Essential for smoothies, soups, and sauces. A high-speed blender can handle everything from 
            frozen fruit to hot soups. Look for one with multiple speed settings and a powerful motor.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">8. Food Processor</h2>
          <p>
            Great for chopping, slicing, and shredding. It saves time on prep work and can handle tasks 
            that are difficult by hand. A 7-cup food processor is perfect for most home cooking needs.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">9. Baking Sheet</h2>
          <p>
            A quality baking sheet is perfect for roasting vegetables, baking cookies, and making sheet 
            pan dinners. Look for heavy-gauge aluminum sheets with rolled edges to prevent warping.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">10. Storage Containers</h2>
          <p>
            Good storage containers keep food fresh and organized. Choose glass or BPA-free plastic options 
            with airtight lids. Having various sizes helps with meal prep and leftovers.
          </p>

          <div className="bg-muted/50 p-6 rounded-lg mt-12">
            <h3 className="text-xl font-bold mb-4">Final Thoughts</h3>
            <p>
              These essentials will form the foundation of a functional kitchen and make cooking more 
              enjoyable and efficient. Start with the basics and gradually build your collection as 
              your cooking skills and needs grow.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
