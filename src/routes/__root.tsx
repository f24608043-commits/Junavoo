import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode, useState } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import { getCategories, type Category } from "@/lib/api/shop.functions";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Heart, User, Menu, X, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SiteHeader />
        <main>
          <Outlet />
        </main>
        <SiteFooter />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function SiteHeader() {
  const { user, role, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["header-categories"],
    queryFn: () => getCategories({ data: { parent_id: null } }),
  });

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-slate-900 text-white text-center text-sm py-2">
        Free shipping on orders over $50. Limited time offer!
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold">
              My Store
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/shop" className="hover:text-primary transition-colors">
                Shop
              </Link>
              
              {/* Categories Dropdown */}
              <div className="relative group">
                <Link 
                  to="/categories" 
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  Categories <ChevronRight className="h-3 w-3 rotate-90" />
                </Link>
                
                {/* Dropdown Menu */}
                <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2 max-h-96 overflow-y-auto">
                    {categories?.map((category) => (
                      <CategoryDropdownItem key={category.id} category={category} />
                    ))}
                  </div>
                </div>
              </div>

              <Link to="/about" className="hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/blog" className="hover:text-primary transition-colors">
                Blog
              </Link>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center gap-3">
              <Link to="/search" className="p-2 hover:text-primary transition-colors">
                <Search className="h-5 w-5" />
              </Link>
              <Link to="/wishlist" className="p-2 hover:text-primary transition-colors relative">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">0</span>
              </Link>
              <Link to="/cart" className="p-2 hover:text-primary transition-colors relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">0</span>
              </Link>
              
              {user ? (
                <div className="relative group">
                  <Link to="/account" className="p-2 hover:text-primary transition-colors">
                    <User className="h-5 w-5" />
                  </Link>
                  {/* User Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      <Link to="/account" className="block px-3 py-2 text-sm hover:bg-slate-50 rounded">Account</Link>
                      <Link to="/account/orders" className="block px-3 py-2 text-sm hover:bg-slate-50 rounded">Orders</Link>
                      <Link to="/wishlist" className="block px-3 py-2 text-sm hover:bg-slate-50 rounded">Wishlist</Link>
                      {role === "admin" && <Link to="/admin" className="block px-3 py-2 text-sm hover:bg-slate-50 rounded">Admin</Link>}
                      <button 
                        onClick={() => signOut()} 
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3 text-sm">
                  <Link to="/auth" className="hover:text-primary transition-colors">
                    Login
                  </Link>
                  <Link 
                    to="/auth" 
                    search={{ mode: "register" }}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border">
            <nav className="flex flex-col px-4 py-4 space-y-3">
              <Link to="/" className="py-2" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/shop" className="py-2" onClick={() => setMobileMenuOpen(false)}>
                Shop
              </Link>
              
              {/* Categories Accordion */}
              <div>
                <button
                  className="flex items-center justify-between w-full py-2"
                  onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                >
                  <span>Categories</span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${mobileCategoriesOpen ? "rotate-90" : ""}`} />
                </button>
                {mobileCategoriesOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {categories?.map((category) => (
                      <Link
                        key={category.id}
                        to="/categories/$slug"
                        params={{ slug: category.slug }}
                        className="block py-1 text-sm text-muted-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/about" className="py-2" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link to="/blog" className="py-2" onClick={() => setMobileMenuOpen(false)}>
                Blog
              </Link>
              <Link to="/contact" className="py-2" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
              
              {!user && (
                <div className="flex gap-3 pt-3 border-t border-border">
                  <Link to="/auth" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/auth" search={{ mode: "register" }} className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Register</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

function CategoryDropdownItem({ category }: { category: Category }) {
  const [showSubcategories, setShowSubcategories] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setShowSubcategories(true)}
      onMouseLeave={() => setShowSubcategories(false)}
    >
      <Link
        to="/categories/$slug"
        params={{ slug: category.slug }}
        className="flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-50 rounded transition-colors"
      >
        <span>{category.name}</span>
        {category.children && category.children.length > 0 && (
          <ChevronRight className="h-3 w-3" />
        )}
      </Link>
      
      {/* Subcategories */}
      {showSubcategories && category.children && category.children.length > 0 && (
        <div className="absolute left-full top-0 ml-2 w-56 bg-white border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
          <div className="p-2">
            {category.children.map((child) => (
              <Link
                key={child.id}
                to="/categories/$slug"
                params={{ slug: child.slug }}
                className="block px-3 py-2 text-sm hover:bg-slate-50 rounded transition-colors"
              >
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">My Store</h3>
            <p className="text-slate-300 text-sm mb-4">
              Quality products delivered to your doorstep. Shop with confidence with our secure payment system.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-slate-300 hover:text-white">Facebook</a>
              <a href="#" className="text-slate-300 hover:text-white">Twitter</a>
              <a href="#" className="text-slate-300 hover:text-white">Instagram</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="text-slate-300 hover:text-white">Shop</Link></li>
              <li><Link to="/blog" className="text-slate-300 hover:text-white">Blog</Link></li>
              <li><Link to="/about" className="text-slate-300 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-white">Contact</Link></li>
              <li><Link to="/faq" className="text-slate-300 hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="text-slate-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="text-slate-300 hover:text-white">Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="text-slate-300 hover:text-white">Shipping Policy</Link></li>
              <li><Link to="/terms" className="text-slate-300 hover:text-white">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Email: support@mystore.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Hours: Mon-Fri 9AM-6PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} My Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
}