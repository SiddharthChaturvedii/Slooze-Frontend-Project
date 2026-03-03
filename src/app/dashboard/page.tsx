"use client";

import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client/core";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { LayoutDashboard, AlertOctagon, Users } from "lucide-react";

const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalProducts
      lowStock
      activeUsers
    }
  }
`;

const CHART_DATA = {
    "This Week": [
        { label: "Mon", value: 40 }, { label: "Tue", value: 70 }, { label: "Wed", value: 45 },
        { label: "Thu", value: 90 }, { label: "Fri", value: 65 }, { label: "Sat", value: 85 }, { label: "Sun", value: 120 }
    ],
    "This Month": [
        { label: "Week 1", value: 200 }, { label: "Week 2", value: 350 },
        { label: "Week 3", value: 280 }, { label: "Week 4", value: 410 }
    ],
    "This Year": [
        { label: "Jan", value: 120 }, { label: "Feb", value: 150 }, { label: "Mar", value: 180 },
        { label: "Apr", value: 130 }, { label: "May", value: 210 }, { label: "Jun", value: 250 },
        { label: "Jul", value: 220 }, { label: "Aug", value: 300 }, { label: "Sep", value: 280 },
        { label: "Oct", value: 340 }, { label: "Nov", value: 380 }, { label: "Dec", value: 450 }
    ]
};

// Stagger definitions
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [timeframe, setTimeframe] = useState<"This Week" | "This Month" | "This Year">("This Week");

    const { data, loading, error } = useQuery<{ dashboardStats: any }>(GET_DASHBOARD_STATS, {
        skip: !isAuthenticated || user?.role !== "MANAGER"
    });

    useEffect(() => {
        if (!isAuthenticated) return;
        if (user?.role !== "MANAGER") {
            router.push("/products");
        }
    }, [isAuthenticated, user, router]);

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <div className="text-foreground tracking-widest uppercase animate-pulse">Loading Telemetry...</div>
        </div>
    );

    if (error) return <div className="text-red-500">System Error: {error.message}</div>;

    const stats = data?.dashboardStats;

    const currentData = CHART_DATA[timeframe];
    // Add 10% headroom so the max bar isn't flush with the top
    const maxVal = Math.max(...currentData.map(d => d.value)) * 1.1;

    return (
        <div className="max-w-7xl mx-auto space-y-10 tracking-wide pt-4">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="flex justify-between items-end border-b border-card-border pb-6"
            >
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-widest uppercase">Global Operations</h1>
                    <p className="text-foreground/60 mt-2 text-sm font-medium">REAL-TIME COMMODITIES TELEMETRY</p>
                </div>
            </motion.div>

            {stats && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Card 1 */}
                    <motion.div variants={itemVariants} className="group">
                        <div className="glass p-6 rounded-xl h-full border border-card-border relative overflow-hidden flex flex-col justify-between group-hover:border-foreground/20 group-hover:bg-foreground/[0.02] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex items-start justify-between">
                                <h3 className="text-xs font-bold text-foreground/60 uppercase tracking-widest">Total Indexed Volumes</h3>
                                <div className="p-2 bg-foreground/5 rounded border border-card-border text-foreground/60 group-hover:text-foreground transition-colors">
                                    <LayoutDashboard className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="text-5xl font-black mt-8 text-foreground tracking-tight">{stats.totalProducts}</p>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div variants={itemVariants} className="group">
                        <div className="glass p-6 rounded-xl h-full border border-card-border relative overflow-hidden flex flex-col justify-between group-hover:border-red-500/30 group-hover:bg-red-500/[0.02] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 pb-full rounded-bl-full transition-colors group-hover:bg-red-500/10" />
                            <div className="flex items-start justify-between relative z-10">
                                <h3 className="text-xs font-bold text-foreground/60 uppercase tracking-widest">Critical Deficits</h3>
                                <div className="p-2 bg-red-500/10 rounded border border-red-500/20 text-red-500/70 group-hover:text-red-500 transition-colors">
                                    <AlertOctagon className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="text-5xl font-black mt-8 text-foreground tracking-tight relative z-10 group-hover:text-red-500 transition-colors">
                                {stats.lowStock}
                            </p>
                        </div>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div variants={itemVariants} className="group">
                        <div className="glass p-6 rounded-xl h-full border border-card-border relative overflow-hidden flex flex-col justify-between group-hover:border-foreground/20 group-hover:bg-foreground/[0.02] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            <div className="flex items-start justify-between">
                                <h3 className="text-xs font-bold text-foreground/60 uppercase tracking-widest">Active Personnel</h3>
                                <div className="p-2 bg-foreground/5 rounded border border-card-border text-foreground/60 group-hover:text-foreground transition-colors">
                                    <Users className="w-4 h-4" />
                                </div>
                            </div>
                            <p className="text-5xl font-black mt-8 text-foreground tracking-tight">{stats.activeUsers}</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Dashboard Charts & Activity */}
            {stats && (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10"
                >
                    {/* Revenue Trajectory Chart */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 p-6 rounded-xl border border-card-border glass bg-card/60 relative group hover:border-foreground/20 transition-all duration-500">
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs tracking-widest uppercase font-bold text-foreground/60">Revenue Trajectory</h3>
                            <select
                                value={timeframe}
                                onChange={(e) => setTimeframe(e.target.value as any)}
                                className="bg-transparent border border-card-border text-xs text-foreground/60 p-1.5 rounded focus:outline-none cursor-pointer hover:border-foreground/40 transition-colors"
                            >
                                <option>This Week</option>
                                <option>This Month</option>
                                <option>This Year</option>
                            </select>
                        </div>

                        <div className="h-48 flex items-end gap-2 mt-4 pt-10">
                            {currentData.map((dataPoint, i) => (
                                <div key={i} className="flex-1 relative group/bar h-full flex flex-col justify-end">
                                    {/* Tooltip on hover */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold py-1.5 px-3 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-xl transform scale-95 group-hover/bar:scale-100 duration-200">
                                        ₹{dataPoint.value}k
                                        {/* Tooltip arrow */}
                                        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45"></div>
                                    </div>

                                    {/* Animated Bar */}
                                    <motion.div
                                        key={timeframe + i} // Re-animate on timeframe change
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(dataPoint.value / maxVal) * 100}%` }}
                                        transition={{ duration: 1.5, delay: i * 0.05, type: "spring", stiffness: 50 }}
                                        className="w-full bg-foreground/10 rounded-t-sm relative overflow-hidden group-hover/bar:bg-foreground/30 transition-colors cursor-crosshair z-10"
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-foreground/40 group-hover/bar:bg-foreground/80 transition-colors"></div>
                                    </motion.div>

                                    {/* Label below bar */}
                                    <div className="text-[10px] text-foreground/40 mt-3 font-mono uppercase tracking-tighter text-center h-4 flex items-center justify-center">
                                        {dataPoint.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Activity Feed */}
                    <motion.div variants={itemVariants} className="p-6 rounded-xl border border-card-border glass bg-card/60 relative group hover:border-foreground/20 transition-all duration-500">
                        <h3 className="text-xs tracking-widest uppercase font-bold text-foreground/60 mb-6">Recent System Activity</h3>
                        <div className="space-y-6">
                            {[
                                { action: "Stock Re-entry", target: "Neuro-Chips v4", user: "manager@slooze.xyz", time: "2m ago" },
                                { action: "Audit Generated", target: "Monthly Logistics", user: "System", time: "1h ago" },
                                { action: "Authorization Failed", target: "Terminal 4", user: "Unknown", time: "3h ago", alert: true },
                                { action: "Shipment Dispatched", target: "Sector 7G", user: "storekeeper@slooze.xyz", time: "5h ago" }
                            ].map((activity, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="min-w-2 mt-1.5 flex flex-col items-center">
                                        <div className={`w-2 h-2 rounded-full ${activity.alert ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]' : 'bg-foreground/40'}`}></div>
                                        {i !== 3 && <div className="w-[1px] h-10 bg-card-border mt-2"></div>}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-bold tracking-wide ${activity.alert ? 'text-red-500' : 'text-foreground'}`}>{activity.action}</p>
                                        <p className="text-xs text-foreground/60">{activity.target}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-[10px] text-foreground/40 font-mono">{activity.user}</p>
                                            <p className="text-[10px] text-foreground/40 uppercase tracking-widest">{activity.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
