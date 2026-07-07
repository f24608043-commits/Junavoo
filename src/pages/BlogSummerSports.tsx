import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { Link } from "react-router-dom";
import { Calendar, ArrowLeft, Clock } from "lucide-react";

export default function BlogSummerSports() {
  return (
    <Layout>
      <SEO 
        title="Summer Sports Gear: What's Trending | Junavoo"
        description="Explore the latest sports equipment and gear trending this summer for outdoor activities and fitness enthusiasts."
      />
      <Breadcrumb items={[
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: "Summer Sports Gear: What's Trending", url: "/blog/summer-sports" }
      ]} />
      
      {/* Hero Image */}
      <div className="w-full h-64 md:h-96 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop&q=75&auto=format"
          alt="Summer sports equipment and gear"
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
          <span>7 min read</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-6">Summer Sports Gear: What's Trending</h1>

        <p className="text-lg text-muted-foreground mb-8 pb-8 border-b leading-relaxed">
          Summer is the perfect time to get active and enjoy outdoor sports. Here's what's trending in 
          sports gear this season for fitness enthusiasts and adventure seekers alike.
        </p>

        <div className="prose prose-neutral max-w-none text-foreground leading-relaxed space-y-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">Water Sports Equipment</h2>
          <p>
            Water sports are incredibly popular during summer months. The right equipment can make your 
            water activities safer and more enjoyable.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Stand-up paddleboards (SUPs)</strong> - Great for full-body workouts and exploring calm waters</li>
            <li><strong>Kayaks and canoes</strong> - Perfect for exploring lakes, rivers, and coastal areas</li>
            <li><strong>Snorkeling gear</strong> - Discover underwater worlds with masks, fins, and snorkels</li>
            <li><strong>Water shoes</strong> - Essential for protecting feet in rocky or sandy areas</li>
            <li><strong>Life jackets</strong> - Safety first for all water activities</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Fitness Gear</h2>
          <p>
            Outdoor fitness has become increasingly popular. Portable and versatile gear allows you to 
            workout anywhere while enjoying the summer weather.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Resistance bands</strong> - Portable and versatile for outdoor workouts</li>
            <li><strong>Yoga mats with carrying straps</strong> - Practice yoga anywhere outdoors</li>
            <li><strong>Smart fitness trackers</strong> - Monitor your progress and stay motivated</li>
            <li><strong>Adjustable dumbbells</strong> - Space-saving strength training option</li>
            <li><strong>Jump ropes</strong> - Excellent cardio equipment that's easy to carry</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Team Sports</h2>
          <p>
            Summer is perfect for team sports and group activities. Having the right equipment makes 
            organizing games easier and more fun.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Volleyball sets</strong> - Great for beach and backyard fun</li>
            <li><strong>Badminton sets</strong> - Perfect for all ages and skill levels</li>
            <li><strong>Soccer balls and goals</strong> - Ideal for backyard practice and pickup games</li>
            <li><strong>Frisbee discs</strong> - Ultimate frisbee is gaining popularity worldwide</li>
            <li><strong>Basketball hoops</strong> - Portable options for driveway or park play</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Outdoor Adventure</h2>
          <p>
            For those who love adventure, having quality outdoor gear is essential for safety and enjoyment 
          during summer expeditions.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Hiking boots and trail shoes</strong> - Comfortable and durable for long walks</li>
            <li><strong>Climbing gear</strong> - For indoor climbing gyms and outdoor rock climbing</li>
            <li><strong>Camping equipment</strong> - Tents, sleeping bags, and camping stoves</li>
            <li><strong>Bike accessories</strong> - Helmets, lights, and repair kits for cycling</li>
            <li><strong>Backpacks</strong> - Comfortable packs for day hikes and longer treks</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Technology Integration</h2>
          <p>
            Modern sports gear increasingly incorporates technology to enhance performance and track progress.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Smart sports equipment</strong> - Track your performance with connected gear</li>
            <li><strong>Wireless earbuds</strong> - Enjoy music during workouts without wires</li>
            <li><strong>Action cameras</strong> - Capture your adventures and share with friends</li>
            <li><strong>GPS watches</strong> - Navigation and tracking for outdoor activities</li>
            <li><strong>Heart rate monitors</strong> - Optimize your training intensity</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Sustainable Options</h2>
          <div className="bg-muted/50 p-6 rounded-lg">
            <p className="mb-4">
              Environmentally conscious consumers are increasingly choosing sustainable sports gear. 
              Look for products made with eco-friendly materials and manufacturing processes.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Eco-friendly materials</strong> - Bamboo, recycled plastics, organic cotton</li>
              <li><strong>Solar-powered gear</strong> - Environmentally conscious charging options</li>
              <li><strong>Durable, long-lasting equipment</strong> - Reduce waste through quality</li>
              <li><strong>Recyclable packaging</strong> - Minimal environmental impact</li>
            </ul>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-bold mb-4">Final Thoughts</h3>
            <p>
              When choosing summer sports gear, consider your fitness level, interests, and budget. 
              Invest in quality equipment that will last multiple seasons and always prioritize safety 
              with proper protective gear. The right equipment can make your summer activities more 
              enjoyable, safe, and effective.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
