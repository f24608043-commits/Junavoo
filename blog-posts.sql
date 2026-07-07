-- Blog Posts for Junavoo
-- Run these SQL statements in your Supabase SQL Editor to create the blog posts

-- Blog Post 1: 10 Kitchen Essentials Every Home Needs
INSERT INTO blog_posts (
  id,
  title,
  slug,
  excerpt,
  content,
  featured_image,
  status,
  published_at,
  author_id,
  seo_title,
  seo_description
) VALUES (
  gen_random_uuid(),
  '10 Kitchen Essentials Every Home Needs',
  'kitchen-essentials',
  'Discover the must-have kitchen tools and appliances that every modern home needs for efficient cooking and meal preparation.',
  'Every well-equipped kitchen needs certain essentials to make cooking efficient and enjoyable. Here are the 10 kitchen essentials that every home should have:

1. **Chef''s Knife** - A high-quality chef''s knife is the most important tool in any kitchen. Invest in one that feels comfortable in your hand and stays sharp.

2. **Cutting Board** - A durable cutting board is essential for food preparation. Choose wooden or plastic boards that are easy to clean and maintain.

3. **Non-Stick Skillet** - Perfect for eggs, pancakes, and delicate foods. A good 10-12 inch non-stick skillet is versatile and easy to clean.

4. **Stockpot** - A large stockpot (6-8 quarts) is essential for making soups, stews, and boiling pasta. Look for one with a heavy bottom for even heating.

5. **Measuring Cups and Spoons** - Accurate measuring is crucial for baking and cooking. Get both dry and liquid measuring cups.

6. **Mixing Bowls** - A set of mixing bowls in various sizes (small, medium, large) will cover most cooking needs.

7. **Blender** - Essential for smoothies, soups, and sauces. A high-speed blender can handle everything from frozen fruit to hot soups.

8. **Food Processor** - Great for chopping, slicing, and shredding. It saves time on prep work and can handle tasks that are difficult by hand.

9. **Baking Sheet** - A quality baking sheet is perfect for roasting vegetables, baking cookies, and making sheet pan dinners.

10. **Storage Containers** - Good storage containers keep food fresh and organized. Choose glass or BPA-free plastic options.

These essentials will form the foundation of a functional kitchen and make cooking more enjoyable and efficient.',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop&q=75&auto=format',
  'published',
  NOW(),
  '00000000-0000-0000-0000-000000000000',
  '10 Kitchen Essentials Every Home Needs | Junavoo',
  'Discover the must-have kitchen tools and appliances that every modern home needs for efficient cooking and meal preparation.'
);

-- Blog Post 2: Choosing the Right Toys for Your Child's Age
INSERT INTO blog_posts (
  id,
  title,
  slug,
  excerpt,
  content,
  featured_image,
  status,
  published_at,
  author_id,
  seo_title,
  seo_description
) VALUES (
  gen_random_uuid(),
  'Choosing the Right Toys for Your Child''s Age',
  'choosing-toys',
  'Learn how to select age-appropriate toys that are safe, educational, and fun for your child''s developmental stage.',
  'Selecting the right toys for your child''s age is crucial for their development, safety, and enjoyment. Here''s a comprehensive guide to help you choose the perfect toys:

**Infants (0-12 months)**
- Soft, colorful toys with different textures
- Rattles and squeaky toys
- Board books with high-contrast images
- Activity gyms and play mats
- Musical toys and mobiles

**Toddlers (1-3 years)**
- Stackable toys and blocks
- Simple puzzles with large pieces
- Push and pull toys
- Shape sorters
- Art supplies (crayons, finger paints)
- Ride-on toys

**Preschoolers (3-5 years)**
- Building sets (LEGO, magnetic blocks)
- Pretend play toys (kitchen sets, dolls)
- Advanced puzzles
- Arts and crafts kits
- Musical instruments
- Outdoor play equipment

**School-Age Children (6-12 years)**
- Science kits and experiments
- Strategy board games
- Sports equipment
- Building and construction toys
- Electronic learning toys
- Creative art supplies

**Safety Tips:**
- Always check age recommendations
- Look for non-toxic materials
- Avoid small parts for young children
- Inspect toys regularly for damage
- Supervise playtime when needed

Remember that the best toys encourage creativity, problem-solving, and physical activity while being appropriate for your child''s developmental stage.',
  'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1200&h=600&fit=crop&q=75&auto=format',
  'published',
  NOW(),
  '00000000-0000-0000-0000-000000000000',
  'Choosing the Right Toys for Your Child''s Age | Junavoo',
  'Learn how to select age-appropriate toys that are safe, educational, and fun for your child''s developmental stage.'
);

-- Blog Post 3: Summer Sports Gear: What's Trending
INSERT INTO blog_posts (
  id,
  title,
  slug,
  excerpt,
  content,
  featured_image,
  status,
  published_at,
  author_id,
  seo_title,
  seo_description
) VALUES (
  gen_random_uuid(),
  'Summer Sports Gear: What''s Trending',
  'summer-sports',
  'Explore the latest sports equipment and gear trending this summer for outdoor activities and fitness enthusiasts.',
  'Summer is the perfect time to get active and enjoy outdoor sports. Here''s what''s trending in sports gear this season:

**Water Sports Equipment**
- Stand-up paddleboards (SUPs) - Great for full-body workouts
- Kayaks and canoes - Perfect for exploring lakes and rivers
- Snorkeling gear - Discover underwater worlds
- Water shoes - Essential for water activities

**Fitness Gear**
- Resistance bands - Portable and versatile for outdoor workouts
- Yoga mats with carrying straps - Practice anywhere
- Smart fitness trackers - Monitor your progress
- Adjustable dumbbells - Space-saving strength training

**Team Sports**
- Volleyball sets - Beach and backyard fun
- Badminton sets - Great for all ages
- Soccer balls and goals - Perfect for backyard practice
- Frisbee discs - Ultimate frisbee is gaining popularity

**Outdoor Adventure**
- Hiking boots and trail shoes - Comfortable and durable
- Climbing gear - For indoor and outdoor climbing
- Camping equipment - Tents, sleeping bags, and more
- Bike accessories - Helmets, lights, and repair kits

**Technology Integration**
- Smart sports equipment - Track your performance
- Wireless earbuds - Music during workouts
- Action cameras - Capture your adventures
- GPS watches - Navigation and tracking

**Sustainable Options**
- Eco-friendly materials - Bamboo, recycled plastics
- Solar-powered gear - Environmentally conscious
- Durable, long-lasting equipment - Reduce waste

When choosing summer sports gear, consider your fitness level, interests, and budget. Invest in quality equipment that will last multiple seasons and always prioritize safety with proper protective gear.',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop&q=75&auto=format',
  'published',
  NOW(),
  '00000000-0000-0000-0000-000000000000',
  'Summer Sports Gear: What''s Trending | Junavoo',
  'Explore the latest sports equipment and gear trending this summer for outdoor activities and fitness enthusiasts.'
);
