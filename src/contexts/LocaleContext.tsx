import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "it";
export type Currency = "USD" | "EUR";

const translations = {
  en: {
    home: "Home", shop: "Shop", categories: "Categories", about: "About",
    contact: "Contact", blog: "Blog", wishlist: "Wishlist", cart: "Cart",
    account: "Account", searchPlaceholder: "Search products...",
    addToCart: "Add to Cart", buyNow: "Buy Now", outOfStock: "Out of Stock",
    inStock: "In Stock", rating: "Rating", reviews: "Reviews",
    freeShipping: "Free Shipping on Orders Over",
    shopNow: "Shop Now", viewAll: "View All", featuredProducts: "Featured Products",
    bestSellers: "Best Sellers", shopByCategory: "Shop by Category",
    stayUpdated: "Stay Updated", subscribe: "Subscribe",
    subscribeDesc: "Subscribe for deals and new arrivals.",
    thankYou: "Thank you for subscribing!",
    yourEmail: "Your email", proceedToCheckout: "Proceed to Checkout",
    orderSummary: "Order Summary", subtotal: "Subtotal", shipping: "Shipping",
    total: "Total", discount: "Discount", free: "Free",
    billingDetails: "Billing Details", paymentMethod: "Payment Method",
    firstName: "First Name", lastName: "Last Name", email: "Email",
    phone: "Phone", address: "Address", city: "City", zipCode: "Zip Code",
    cashOnDelivery: "Cash on Delivery", creditCard: "Credit/Debit Card (Coming Soon)",
    placeOrder: "Place Order", cartEmpty: "Your Cart is Empty",
    continueShopping: "Continue Shopping", quantity: "Qty",
    description: "Description", specifications: "Specifications",
    relatedProducts: "Related Products", couponCode: "Coupon code", apply: "Apply",
    latestBlogs: "Latest Articles", readMore: "Read More",
    language: "Language", currency: "Currency",
    allProducts: "All Products", resultsFor: "Results for",
    noProducts: "No products found.",
  },
  it: {
    home: "Home", shop: "Negozio", categories: "Categorie", about: "Chi Siamo",
    contact: "Contatti", blog: "Blog", wishlist: "Lista Desideri", cart: "Carrello",
    account: "Account", searchPlaceholder: "Cerca prodotti...",
    addToCart: "Aggiungi al Carrello", buyNow: "Acquista Ora", outOfStock: "Esaurito",
    inStock: "Disponibile", rating: "Valutazione", reviews: "Recensioni",
    freeShipping: "Spedizione Gratuita per Ordini Superiori a",
    shopNow: "Acquista Ora", viewAll: "Vedi Tutti", featuredProducts: "Prodotti in Evidenza",
    bestSellers: "Best Seller", shopByCategory: "Acquista per Categoria",
    stayUpdated: "Rimani Aggiornato", subscribe: "Iscriviti",
    subscribeDesc: "Iscriviti per offerte e nuovi arrivi.",
    thankYou: "Grazie per esserti iscritto!",
    yourEmail: "La tua email", proceedToCheckout: "Procedi al Pagamento",
    orderSummary: "Riepilogo Ordine", subtotal: "Subtotale", shipping: "Spedizione",
    total: "Totale", discount: "Sconto", free: "Gratis",
    billingDetails: "Dati di Fatturazione", paymentMethod: "Metodo di Pagamento",
    firstName: "Nome", lastName: "Cognome", email: "Email",
    phone: "Telefono", address: "Indirizzo", city: "Città", zipCode: "CAP",
    cashOnDelivery: "Contrassegno", creditCard: "Carta di Credito/Debito (Prossimamente)",
    placeOrder: "Effettua Ordine", cartEmpty: "Il Tuo Carrello è Vuoto",
    continueShopping: "Continua gli Acquisti", quantity: "Qtà",
    description: "Descrizione", specifications: "Specifiche",
    relatedProducts: "Prodotti Correlati", couponCode: "Codice coupon", apply: "Applica",
    latestBlogs: "Ultimi Articoli", readMore: "Leggi di Più",
    language: "Lingua", currency: "Valuta",
    allProducts: "Tutti i Prodotti", resultsFor: "Risultati per",
    noProducts: "Nessun prodotto trovato.",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

type LocaleContextType = {
  language: Language;
  currency: Currency;
  setLanguage: (l: Language) => void;
  setCurrency: (c: Currency) => void;
  t: (key: TranslationKey) => string;
  formatPrice: (usdPrice: number, eurPrice?: number | null) => string;
  convertPrice: (usdPrice: number) => number;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem("junavo-lang") as Language) || "en"
  );
  const [currency, setCurrency] = useState<Currency>(
    () => (localStorage.getItem("junavo-currency") as Currency) || "USD"
  );

  const handleSetLanguage = (l: Language) => {
    setLanguage(l);
    localStorage.setItem("junavo-lang", l);
  };

  const handleSetCurrency = (c: Currency) => {
    setCurrency(c);
    localStorage.setItem("junavo-currency", c);
  };

  const t = (key: TranslationKey): string => translations[language][key];

  // convertPrice: identity when EUR has no stored value — no auto-conversion
  const convertPrice = (usdPrice: number): number => usdPrice;

  // formatPrice: uses explicit eurPrice if available, otherwise shows USD
  const formatPrice = (usdPrice: number, eurPrice?: number | null): string => {
    if (currency === "EUR" && eurPrice != null) {
      return `€${eurPrice.toFixed(2)}`;
    }
    if (currency === "EUR") {
      return `€${usdPrice.toFixed(2)}`;
    }
    return `$${usdPrice.toFixed(2)}`;
  };

  return (
    <LocaleContext.Provider value={{ language, currency, setLanguage: handleSetLanguage, setCurrency: handleSetCurrency, t, formatPrice, convertPrice }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
