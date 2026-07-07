import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SplineScene } from "./SplineScene";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";
import { ArrowRight } from "lucide-react";

export function Hero() {
    const { language, t } = useLocale();
    const isItalian = language === "it";
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    const y2 = useTransform(scrollY, [0, 500], [0, -50]);

    const variants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                ease: [0.21, 0.45, 0.32, 0.9] as any,
            },
        }),
    };

    const text = {
        en: {
            badge: "NEW ARRIVALS THIS WEEK",
            headline: ["Everything You Need.", "One Place."],
            subtext: "Premium Tech. Smart Tools. Trendy Toys. Modern Fashion.\nCurated for the modern lifestyle.",
            ctaPrimary: "Shop Now",
            ctaSecondary: "Browse Categories",
            trust: "Join 10,000+ happy customers worldwide.",
        },
        it: {
            badge: "NUOVI ARRIVI QUESTA SETTIMANA",
            headline: ["Tutto ciò di cui hai bisogno.", "Un solo posto."],
            subtext: "Tecnologia Premium. Strumenti intelligenti. Giocattoli moderni. Moda contemporanea.\nSelezionati per lo stile di vita moderno.",
            ctaPrimary: "Acquista ora",
            ctaSecondary: "Esplora categorie",
            trust: "Unisciti a oltre 10.000 clienti soddisfatti nel mondo.",
        },
    };

    const content = isItalian ? text.it : text.en;

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:bg-gradient-to-br dark:from-slate-950 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800"
        >
            <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12 z-10 py-20 md:py-0">
                {/* Left Side - Sales Text */}
                <div className="flex-1 text-left">
                    <motion.div
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                        className="mb-6"
                    >
                        <motion.span
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="inline-block px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-widest bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        >
                            ✦ {content.badge}
                        </motion.span>
                    </motion.div>

                    <motion.h1
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-slate-900 dark:text-white"
                    >
                        {content.headline[0]}
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-orange-400">
                            {content.headline[1]}
                        </span>
                    </motion.h1>

                    <motion.p
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                        className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-lg leading-relaxed whitespace-pre-line"
                    >
                        {content.subtext}
                    </motion.p>

                    <motion.div
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                        className="flex flex-col sm:flex-row items-center gap-4 mb-10"
                    >
                        <Button
                            asChild
                            size="lg"
                            className="w-full sm:w-auto rounded-full px-8 py-7 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 dark:bg-blue-500 dark:hover:bg-blue-400"
                        >
                            <Link to="/shop" className="flex items-center gap-2">
                                {content.ctaPrimary} <ArrowRight className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto rounded-full px-8 py-7 text-lg font-medium border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-300"
                        >
                            <Link to="/categories">{content.ctaSecondary}</Link>
                        </Button>
                    </motion.div>

                    <motion.p
                        custom={4}
                        initial="hidden"
                        animate="visible"
                        variants={variants}
                        className="text-sm font-medium text-slate-500 dark:text-slate-500"
                    >
                        {content.trust}
                    </motion.p>
                </div>

                {/* Right Side - Spline Scene */}
                <div className="flex-1 relative w-full min-h-[400px] md:min-h-[600px] pointer-events-none md:pointer-events-auto">
                    <motion.div
                        style={{ y: y2 }}
                        className="w-full h-full"
                    >
                        <SplineScene
                            scene="https://prod.spline.design/6Wq1Q7YGyWf8ZreR/scene.splinecode"
                            className="w-full h-full"
                        />
                    </motion.div>

                    {/* Subtle Glow Backdrop */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
                </div>
            </div>

            {/* Background Orbs */}
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-200/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-orange-100/20 blur-[100px] rounded-full pointer-events-none" />
        </section>
    );
}
