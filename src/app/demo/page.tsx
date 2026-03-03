"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
    return (
        <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
            <header className="py-8 text-center bg-white shadow-sm z-50">
                <h1 className="text-4xl font-black text-gray-900 mb-2">Aesthetic Prototypes</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Interact with the cards below. Each represents a completely unique design philosophy.
                    Choose your favorite, and I will apply it globally along with the Light/Dark mode toggle.
                </p>
                <div className="mt-4">
                    <Link href="/login" className="text-blue-500 hover:underline">← Back to Login</Link>
                </div>
            </header>

            <div className="flex-1 flex flex-col md:flex-row w-full h-full">

                {/* OPTION 1: AURORA GLASSMORPHISM */}
                <div className="flex-1 relative p-10 min-h-[500px] flex flex-col items-center justify-center bg-[#020617] overflow-hidden border-r border-white/10">
                    <div className="absolute top-4 left-4 text-white/50 text-sm font-bold tracking-widest uppercase">Option 1: Aurora Glass</div>

                    {/* Animated Aurora Blobs */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600/30 rounded-full blur-[80px]"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600/30 rounded-full blur-[80px]"
                    />

                    {/* Glass Card */}
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="z-10 bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full max-w-[320px]"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-white/80 font-medium tracking-wide">System Security</h3>
                            <Shield className="text-blue-400 w-6 h-6" />
                        </div>
                        <p className="text-5xl font-light text-white mb-8 tracking-tight">Active</p>
                        <button className="w-full py-4 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30 hover:bg-blue-500 hover:text-white transition-all duration-500 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                            View Security Logs
                        </button>
                    </motion.div>
                </div>

                {/* OPTION 2: NEOBRUTALISM */}
                <div className="flex-1 relative p-10 min-h-[500px] flex flex-col items-center justify-center bg-[#fef08a] border-r border-black">
                    <div className="absolute top-4 left-4 text-black text-sm font-black tracking-widest uppercase">Option 2: Neobrutalism</div>

                    {/* Brutalist Card */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="z-10 bg-white border-4 border-black p-8 shadow-[12px_12px_0px_#000] w-full max-w-[320px]"
                    >
                        <div className="flex justify-between items-center mb-10 border-b-4 border-black pb-4">
                            <h3 className="text-black font-black uppercase text-xl">Energy Output</h3>
                            <Zap className="text-black w-8 h-8 fill-yellow-400" />
                        </div>
                        <p className="text-6xl font-black text-black mb-8 leading-none">HIGH</p>

                        <motion.button
                            whileHover={{ x: -4, y: -4, boxShadow: "8px 8px 0px #000" }}
                            whileTap={{ x: 0, y: 0, boxShadow: "0px 0px 0px #000" }}
                            className="w-full py-4 bg-[#f97316] text-black font-black uppercase text-lg border-4 border-black shadow-[4px_4px_0px_#000] transition-all"
                        >
                            Throttle Down
                        </motion.button>
                    </motion.div>
                </div>

                {/* OPTION 3: CLAYMORPHISM */}
                <div className="flex-1 relative p-10 min-h-[500px] flex flex-col items-center justify-center bg-[#e2e8f0]">
                    <div className="absolute top-4 left-4 text-[#64748b] text-sm font-extrabold tracking-widest uppercase">Option 3: Claymorphism</div>

                    {/* Clay Card */}
                    <motion.div
                        whileHover={{ y: -8, rotateX: 5, rotateY: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="z-10 bg-[#f1f5f9] p-8 rounded-[2.5rem] w-full max-w-[320px] shadow-[16px_16px_32px_#cbd5e1,-16px_-16px_32px_#ffffff]"
                        style={{ perspective: 1000 }}
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-[#64748b] font-bold text-lg">Total Volumes</h3>
                            <div className="p-3 bg-[#e2e8f0] rounded-2xl shadow-[inset_4px_4px_8px_#cbd5e1,inset_-4px_-4px_8px_#ffffff]">
                                <LayoutDashboard className="text-[#3b82f6] w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-6xl font-extrabold text-[#334155] mb-8 tracking-tighter">14k</p>

                        <motion.button
                            whileTap={{ scale: 0.95, boxShadow: "inset 6px 6px 12px #9d2449, inset -6px -6px 12px #ff4891" }}
                            className="w-full py-4 bg-[#ec4899] text-white font-bold text-lg tracking-wide rounded-full shadow-[6px_6px_12px_#cbd5e1,-6px_-6px_12px_#ffffff,inset_2px_2px_4px_rgba(255,255,255,0.4)] transition-colors hover:bg-[#db3e88]"
                        >
                            View Details
                        </motion.button>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
