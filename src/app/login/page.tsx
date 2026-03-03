"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client/core";
import { useAuth } from "@/components/providers/AuthProvider";
import { motion, useAnimate } from "framer-motion";
import { Playfair_Display, Ballet } from "next/font/google";
import { useRouter } from "next/navigation";

const playfair = Playfair_Display({
    subsets: ["latin"],
    style: ["normal", "italic"],
    weight: ["400", "500", "600"]
});

const cursive = Ballet({
    subsets: ["latin"],
});

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        role
      }
    }
  }
`;

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const { login: authLogin } = useAuth();
    const router = useRouter();
    const [scope, animate] = useAnimate();

    const [login, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted: async (data: any) => {
            const targetUrl = data.login.user.role === "MANAGER" ? "/dashboard" : "/products";
            authLogin(data.login.user, data.login.token, true);

            // Step 1: Detect Screen Size
            const isMobile = window.innerWidth < 768;

            if (isMobile) {
                // Mobile Animation: The Portal itself zooms and fades
                const m1 = animate(".left-panel", { scale: 15, opacity: 0, filter: "blur(20px)" }, { duration: 1.8, ease: "easeInOut" });
                await m1;
            } else {
                // Desktop Animation: Slide and Typographic Zoom
                const offset = window.innerWidth >= 1024 ? 250 : 240;

                const p1 = animate(".left-panel", { x: "-100%" }, { duration: 1.5, ease: "easeInOut" });
                const p2 = animate(".typographic-art", { x: -offset }, { duration: 1.5, ease: "easeInOut" });

                await Promise.all([p1, p2]);

                // Text slowly zooms until ~4 letters are visible
                const p3 = animate(".typographic-art", { scale: 6 }, { duration: 2.0, ease: "easeInOut" });

                // Screen blurs out at the ending of the zoom
                const p4 = animate(scope.current, { filter: "blur(20px)", opacity: 0 }, { duration: 0.8, delay: 1.2, ease: "easeOut" });

                await Promise.all([p3, p4]);
            }

            router.push(targetUrl);
        },
        onError: (error) => {
            setErrorMsg(error.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        login({ variables: { email, password } });
    };

    return (
        <div ref={scope} className="flex min-h-screen bg-[#020202] text-white overflow-hidden">
            {/* LEFT PANEL: The Portal */}
            <div className="left-panel w-full md:w-[480px] lg:w-[500px] flex flex-col justify-center px-10 md:px-16 py-12 border-r border-white/5 bg-[#020202] z-40 shrink-0 shadow-2xl relative">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-sm mx-auto"
                >
                    <div className="text-section mb-16 relative origin-left z-50 pointer-events-none">
                        <h1 className={`text-3xl font-medium text-white mb-2 ${playfair.className} tracking-wide pointer-events-auto`}>
                            Slooze.
                        </h1>
                        <p className="text-gray-500 text-sm tracking-wide">
                            Secure terminal authentication.
                        </p>
                    </div>

                    <div className="form-section w-full">
                        {errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 p-3 bg-red-500/10 border-l-2 border-red-500/50 text-red-500 text-sm"
                            >
                                {errorMsg}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="group">
                                <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-widest group-focus-within:text-white transition-colors">
                                    Identity Sequence
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-all text-sm"
                                    placeholder="manager@slooze.xyz"
                                    required
                                />
                            </div>

                            <div className="group">
                                <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-widest group-focus-within:text-white transition-colors">
                                    Access Key
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white transition-all text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="pt-8">
                                <motion.button
                                    onHoverStart={() => setIsHovered(true)}
                                    onHoverEnd={() => setIsHovered(false)}
                                    whileHover={{ scale: 1.04, backgroundColor: "#ffffff", color: "#000000" }}
                                    whileTap={{ scale: 0.96 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 bg-white/90 text-black font-bold transition-all disabled:opacity-50 flex justify-center items-center relative overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                                >
                                    <motion.div
                                        className={`absolute inset-0 flex items-center justify-center font-normal ${cursive.className} text-4xl gap-3 -mt-3`}
                                        initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
                                        animate={{
                                            opacity: isHovered && !loading ? 1 : 0,
                                            filter: isHovered && !loading ? "blur(0px)" : "blur(12px)",
                                            scale: isHovered && !loading ? 1 : 0.95
                                        }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    >
                                        <span>EnterSystem</span>
                                        <span className="font-sans font-light tracking-tighter text-xl opacity-80 mt-1.5">&rarr;</span>
                                    </motion.div>

                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center tracking-widest uppercase text-xs gap-3"
                                        initial={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                                        animate={{
                                            opacity: isHovered || loading ? 0 : 1,
                                            filter: isHovered || loading ? "blur(12px)" : "blur(0px)",
                                            scale: isHovered || loading ? 1.05 : 1
                                        }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    >
                                        Enter System
                                        <span className="text-sm font-light opacity-80">&rarr;</span>
                                    </motion.div>

                                    {loading && (
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center tracking-widest uppercase text-xs"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            Authenticating...
                                        </motion.div>
                                    )}
                                </motion.button>
                            </div>
                        </form>

                        <div className="mt-12 text-[10px] text-gray-500 uppercase tracking-widest flex flex-col gap-2 border-t border-white/5 pt-6">
                            <p>Demo Credentials:</p>
                            <p className="text-gray-400">MGR: manager@slooze.xyz / admin123</p>
                            <p className="text-gray-400">KPR: storekeeper@slooze.xyz / store123</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* RIGHT PANEL: Typographic Art */}
            <div className="right-panel flex-1 hidden md:flex items-center justify-center bg-[#020202] relative">
                {/* Subtle Grain/Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')", backgroundSize: "cover" }} />

                <motion.div
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    className={`typographic-art flex flex-col gap-8 w-full max-w-4xl mx-auto ${playfair.className} text-[6.5vw] lg:text-[7vw] xl:text-[8vw] leading-[0.85] tracking-tighter cursor-default select-none z-50`}
                >
                    {/* Line 1 */}
                    <div className="flex items-baseline justify-start gap-4 ml-[12%]">
                        <span className="text-[12px] lg:text-[14px] font-sans tracking-[0.3em] font-light text-gray-400 mb-2">01</span>
                        <div className="hover:text-gray-300 transition-colors duration-500">Sl<span className="italic">oo</span>ze</div>
                    </div>

                    {/* Line 2 */}
                    <div className="flex items-baseline justify-end gap-4 mr-[10%]">
                        <div className="hover:text-gray-300 transition-colors duration-500">C<span className="italic">ommoditi</span>es</div>
                        <span className="text-[12px] lg:text-[14px] font-sans tracking-[0.3em] font-light text-gray-400 mb-2">02</span>
                    </div>

                    {/* Line 3 */}
                    <div className="flex items-baseline justify-start gap-4 ml-[15%]">
                        <span className="text-[12px] lg:text-[14px] font-sans tracking-[0.3em] font-light text-gray-400 mb-2">03</span>
                        <div className="hover:text-gray-300 transition-colors duration-500">L<span className="italic">edge</span>r</div>
                    </div>

                    {/* Line 4 */}
                    <div className="flex items-baseline justify-end gap-4 mr-[15%]">
                        <div className="hover:text-gray-300 transition-colors duration-500">N<span className="italic">exu</span>s</div>
                        <span className="text-[12px] lg:text-[14px] font-sans tracking-[0.3em] font-light text-gray-400 mb-2">04</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
