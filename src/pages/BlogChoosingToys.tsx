import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import Breadcrumb from "@/components/Breadcrumb";
import { Link } from "react-router-dom";
import { Calendar, ArrowLeft, Clock } from "lucide-react";

export default function BlogChoosingToys() {
  return (
    <Layout>
      <SEO 
        title="Choosing the Right Toys for Your Child's Age | Junavoo"
        description="Learn how to select age-appropriate toys that are safe, educational, and fun for your child's developmental stage."
      />
      <Breadcrumb items={[
        { name: "Home", url: "/" },
        { name: "Blog", url: "/blog" },
        { name: "Choosing the Right Toys for Your Child's Age", url: "/blog/choosing-toys" }
      ]} />
      
      {/* Hero Image */}
      <div className="w-full h-64 md:h-96 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1920&h=1080&fit=crop&q=75&auto=format"
          alt="Colorful toys for children"
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
          <span>10 min read</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-6">Choosing the Right Toys for Your Child's Age</h1>

        <p className="text-lg text-muted-foreground mb-8 pb-8 border-b leading-relaxed">
          Selecting the right toys for your child's age is crucial for their development, safety, and enjoyment. 
          Here's a comprehensive guide to help you choose the perfect toys for every stage of childhood.
        </p>

        <div className="prose prose-neutral max-w-none text-foreground leading-relaxed space-y-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">Infants (0-12 months)</h2>
          <p>
            During the first year, babies are developing their senses and motor skills. Focus on toys that 
            stimulate sight, sound, and touch while being completely safe for mouthing.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Soft, colorful toys with different textures</li>
            <li>Rattles and squeaky toys</li>
            <li>Board books with high-contrast images</li>
            <li>Activity gyms and play mats</li>
            <li>Musical toys and mobiles</li>
            <li>Teething toys and rings</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Toddlers (1-3 years)</h2>
          <p>
            Toddlers are becoming more mobile and curious. Toys should encourage exploration, fine motor 
            skills, and early problem-solving while being durable enough for active play.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Stackable toys and blocks</li>
            <li>Simple puzzles with large pieces</li>
            <li>Push and pull toys</li>
            <li>Shape sorters</li>
            <li>Art supplies (crayons, finger paints)</li>
            <li>Ride-on toys</li>
            <li>Dolls and stuffed animals</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Preschoolers (3-5 years)</h2>
          <p>
            Preschoolers are developing imagination, social skills, and more complex motor abilities. Choose 
            toys that foster creativity, cooperation, and early learning concepts.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Building sets (LEGO, magnetic blocks)</li>
            <li>Pretend play toys (kitchen sets, dolls, dress-up)</li>
            <li>Advanced puzzles</li>
            <li>Arts and crafts kits</li>
            <li>Musical instruments</li>
            <li>Outdoor play equipment (slides, swings)</li>
            <li>Board games for simple rules</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">School-Age Children (6-12 years)</h2>
          <p>
            School-age children have developed more complex thinking skills and specific interests. Toys should 
            challenge them intellectually while supporting their hobbies and physical activities.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Science kits and experiments</li>
            <li>Strategy board games</li>
            <li>Sports equipment</li>
            <li>Building and construction toys</li>
            <li>Electronic learning toys</li>
            <li>Creative art supplies</li>
            <li>Coding and robotics kits</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Safety Tips</h2>
          <div className="bg-muted/50 p-6 rounded-lg">
            <ul className="list-disc pl-6 space-y-2">
              <li>Always check age recommendations on packaging</li>
              <li>Look for non-toxic, BPA-free materials</li>
              <li>Avoid small parts for children under 3</li>
              <li>Inspect toys regularly for damage or wear</li>
              <li>Supervise playtime when needed</li>
              <li>Ensure toys meet safety standards</li>
              <li>Store toys properly to prevent accidents</li>
            </ul>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-bold mb-4">Final Thoughts</h3>
            <p>
              Remember that the best toys encourage creativity, problem-solving, and physical activity while 
              being appropriate for your child's developmental stage. Focus on quality over quantity, and 
              choose toys that can grow with your child through multiple stages of development.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
