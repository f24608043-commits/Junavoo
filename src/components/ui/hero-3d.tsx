import { motion } from "framer-motion";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLocale } from "@/contexts/LocaleContext";

export default function Hero3D() {
    const { language } = useLocale();
    const isItalian = language === "it";

    const text = {
        en: {
            headline: "Junavo",
            ctaPrimary: "Shop Now",
            ctaSecondary: "Blog",
        },
        it: {
            headline: "Junavo",
            ctaPrimary: "Acquista Ora",
            ctaSecondary: "Blog",
        },
    };

    const content = isItalian ? text.it : text.en;

    return (
        <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white to-blue-50 dark:from-slate-950 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
            {/* Background Interactive Elements */}
            <Spotlight size={800} />

            {/* SPLINE ANIMATION - CENTRALLY ALIGNED - ENABLING INTERACTION */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto"
            >
                <div className="w-full h-full max-w-5xl translate-y-12">
                    <SplineScene
                        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                        className="w-full h-full"
                    />
                </div>
                {/* Ambient Blue Glow Behind Bot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-400/5 blur-[120px] rounded-full -z-10 animate-pulse" />
            </motion.div>

            {/* CONTENT OVERLAY - CENTRALLY ALIGNED - PASSING MOUSE EVENTS THROUGH TEXT TO BOT */}
            <div className="container relative mx-auto px-6 z-10 flex flex-col items-center justify-center text-center pointer-events-none">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                    className="flex flex-col items-center gap-12"
                >
                    <h1 className="text-7xl md:text-9xl lg:text-[14rem] font-black tracking-tighter leading-[0.8] text-orange-500 dark:text-white drop-shadow-2xl select-none pointer-events-none">
                        {content.headline}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4 pointer-events-auto">
                        <Button
                            asChild
                            size="lg"
                            className="px-10 py-8 rounded-2xl text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-500/40 hover:scale-[1.05] transition-all duration-300 dark:bg-blue-500 dark:hover:bg-blue-400"
                        >
                            <Link to="/shop" className="flex items-center gap-2">
                                {content.ctaPrimary} <ArrowRight className="w-6 h-6" />
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="px-10 py-8 rounded-2xl text-xl font-bold border-2 border-slate-200 hover:bg-white dark:border-slate-800 dark:hover:bg-slate-800 backdrop-blur-md transition-all duration-300"
                        >
                            <Link to="/blog">{content.ctaSecondary}</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-orange-200/5 blur-[150px] rounded-full pointer-events-none" />
        </section>
    );
}
