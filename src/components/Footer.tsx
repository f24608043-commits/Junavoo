import { Link } from "react-router-dom";
import { CATEGORIES } from "@/lib/constants";
import { useLocale } from "@/contexts/LocaleContext";

export default function Footer() {
  const { t, language } = useLocale();

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-3">
              <span className="text-foreground">Jun</span><span className="orange-accent">avo</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {language === "it" ? "Tutto ciò di cui hai bisogno. Un posto." : "Everything you need. One place."}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <a href="#" className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-sm hover:bg-primary hover:text-primary-foreground transition-colors">f</a>
              <a href="#" className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-sm hover:bg-primary hover:text-primary-foreground transition-colors">in</a>
              <a href="#" className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-sm hover:bg-primary hover:text-primary-foreground transition-colors">tw</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">
              {language === "it" ? "Link Rapidi" : "Quick Links"}
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/", label: t("home") },
                { to: "/shop", label: t("shop") },
                { to: "/blog", label: t("blog") },
                { to: "/about", label: t("about") },
                { to: "/contact", label: t("contact") },
                { to: "/faq", label: "FAQ" },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">{t("categories")}</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="text-muted-foreground hover:text-foreground transition-colors">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">
              {language === "it" ? "Assistenza Clienti" : "Customer Service"}
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/privacy", label: language === "it" ? "Privacy Policy" : "Privacy Policy" },
                { to: "/terms", label: language === "it" ? "Termini & Condizioni" : "Terms & Conditions" },
                { to: "/refund", label: language === "it" ? "Politica di Rimborso" : "Refund Policy" },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 rounded-xl bg-muted/60 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Need help?</p>
              <p>support@junavo.com</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Junavo. {language === "it" ? "Tutti i diritti riservati." : "All rights reserved."}</p>
          <p className="flex items-center gap-2">
            🔒 {language === "it" ? "Pagamento sicuro garantito" : "Secure & trusted checkout"}
          </p>
        </div>
      </div>
    </footer>
  );
}
