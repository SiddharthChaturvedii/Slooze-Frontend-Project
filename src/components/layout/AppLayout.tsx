"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isAuthenticated } = useAuth();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch for theme toggle
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (!isAuthenticated || pathname === "/login") {
        return <>{children}</>;
    }

    const isManager = user?.role === "MANAGER";

    return (
        <div className="flex h-screen overflow-hidden bg-background relative text-foreground">
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            {/* Futuristic Sidebar */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-68 z-20 flex flex-col border-r border-card-border glass bg-card/40 backdrop-blur-3xl"
            >
                <div className="p-6 border-b border-card-border">
                    <h1 className="text-2xl font-black tracking-widest mb-1 text-foreground">
                        SLOOZE
                    </h1>
                    <p className="text-xs text-foreground/50 uppercase font-bold tracking-widest">
                        Admin Console
                    </p>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2 relative">
                    {isManager && (
                        <Link href="/dashboard" className="relative group block">
                            {pathname === '/dashboard' && (
                                <motion.div
                                    layoutId="active-nav"
                                    className="absolute inset-0 bg-foreground/10 border border-foreground/20 rounded-lg pointer-events-none"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className={`p-3 rounded-lg relative z-10 font-medium tracking-wide transition-colors ${pathname === '/dashboard' ? 'text-foreground font-bold' : 'text-foreground/50 group-hover:text-foreground/80'}`}>
                                Dashboard
                            </div>
                        </Link>
                    )}

                    <Link href="/products" className="relative group block">
                        {pathname === '/products' && (
                            <motion.div
                                layoutId="active-nav"
                                className="absolute inset-0 bg-foreground/10 border border-foreground/20 rounded-lg pointer-events-none"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <div className={`p-3 rounded-lg relative z-10 font-medium tracking-wide transition-colors ${pathname === '/products' ? 'text-foreground font-bold' : 'text-foreground/50 group-hover:text-foreground/80'}`}>
                            Products
                        </div>
                    </Link>
                </nav>

                <div className="p-6 border-t border-card-border glass bg-transparent">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center text-foreground font-bold">
                            {user?.name.charAt(0)}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-foreground tracking-wide">{user?.name}</div>
                            <div className="text-xs text-foreground/50 tracking-widest uppercase">{user?.role}</div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        onClick={logout}
                        className="w-full text-left p-3 text-red-500 border border-red-500/40 rounded-lg bg-red-500/10 hover:bg-red-500 hover:text-white transition-colors duration-300 font-bold tracking-widest uppercase text-sm text-center shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                    >
                        Terminate Session
                    </motion.button>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-auto z-10 relative">
                <header className="h-[73px] flex items-center px-8 border-b border-card-border glass bg-card/20 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xl font-bold text-foreground tracking-widest uppercase"
                    >
                        {pathname.replace('/', '') === 'products' ? 'Products' : pathname.replace('/', '') || 'System'}
                    </motion.h2>
                    <div className="ml-auto flex items-center gap-6">

                        {/* Smart Theme Toggle */}
                        {mounted && (
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="flex items-center justify-center w-8 h-8 rounded-full border border-card-border bg-card hover:bg-foreground hover:text-background text-foreground/70 transition-all shadow-sm"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                        )}

                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/50 tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            ONLINE
                        </div>
                    </div>
                </header>

                <main className="p-8 pb-20 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
