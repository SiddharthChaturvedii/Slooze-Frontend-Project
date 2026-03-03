"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client/core";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { PackageOpen, Plus, X, Edit3, Server } from "lucide-react";

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      category
      price
      stock
      status
    }
  }
`;

const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $category: String!, $price: Float!, $stock: Int!) {
    addProduct(name: $name, category: $category, price: $price, stock: $stock) {
      id
      name
      category
      price
      stock
      status
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $name: String, $category: String, $price: Float, $stock: Int) {
    updateProduct(id: $id, name: $name, category: $category, price: $price, stock: $stock) {
      id
      name
      category
      price
      stock
      status
    }
  }
`;

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
};

export default function ProductsPage() {
    const { data: productsData, loading, error } = useQuery<{ products: any[] }>(GET_PRODUCTS);
    const [addProduct] = useMutation(ADD_PRODUCT, { refetchQueries: [{ query: GET_PRODUCTS }] });
    const [updateProduct] = useMutation(UPDATE_PRODUCT, { refetchQueries: [{ query: GET_PRODUCTS }] });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", category: "", price: 0, stock: 0 });

    const handleEdit = (product: any) => {
        setEditingId(product.id);
        setFormData({ name: product.name, category: product.category, price: product.price, stock: product.stock });
        setIsModalOpen(true);
    };

    const handleOpenNew = () => {
        setEditingId(null);
        setFormData({ name: "", category: "", price: 0, stock: 0 });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            await updateProduct({ variables: { id: editingId, ...formData, price: Number(formData.price), stock: Number(formData.stock) } });
        } else {
            await addProduct({ variables: { ...formData, price: Number(formData.price), stock: Number(formData.stock) } });
        }
        setIsModalOpen(false);
    };

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <div className="text-foreground/60 font-mono tracking-widest uppercase animate-pulse">Syncing Ledger...</div>
        </div>
    );
    if (error) return <div className="text-red-500">System Error: {error.message}</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-10 tracking-wide pt-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-end border-b border-card-border pb-6"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-foreground/5 rounded-xl border border-card-border">
                        <Server className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-widest uppercase">Products Ledger</h1>
                        <p className="text-foreground/60 mt-1 text-xs font-bold tracking-widest">DECENTRALIZED INVENTORY INDEX</p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    onClick={handleOpenNew}
                    className="flex items-center gap-2 bg-foreground text-background border border-foreground px-6 py-3 rounded-lg hover:bg-foreground/90 font-bold tracking-widest uppercase transition-colors shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]"
                >
                    <Plus className="w-4 h-4" />
                    New Asset
                </motion.button>
            </motion.div>

            {/* Futuristic Data Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="glass rounded-xl overflow-hidden border border-card-border relative"
            >
                <div className="overflow-x-auto bg-card/40 backdrop-blur-md">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/50 border-b border-card-border text-xs text-primary uppercase font-bold tracking-widest">
                                <th className="p-5">Asset ID</th>
                                <th className="p-5">Nomenclature</th>
                                <th className="p-5">Sector</th>
                                <th className="p-5">Valuation</th>
                                <th className="p-5">Reserves</th>
                                <th className="p-5">Status</th>
                                <th className="p-5">Directive</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsData?.products.map((product: any) => (
                                <motion.tr
                                    variants={rowVariants}
                                    key={product.id}
                                    className="border-b border-card-border hover:bg-primary/5 transition-colors group"
                                >
                                    <td className="p-5 font-mono text-foreground/50">#{product.id.padStart(4, '0')}</td>
                                    <td className="p-5 font-medium text-foreground group-hover:text-primary transition-colors">{product.name}</td>
                                    <td className="p-5 text-foreground/70">{product.category}</td>
                                    <td className="p-5 text-foreground/80">₹{product.price.toFixed(2)}</td>
                                    <td className="p-5 text-foreground/80 font-mono">{product.stock}</td>
                                    <td className="p-5">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full tracking-wider uppercase border ${product.status === 'IN_STOCK' ? 'bg-secondary text-foreground border-foreground/20' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                                            {product.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <motion.button
                                            whileHover={{ scale: 1.2, rotate: 5 }}
                                            whileTap={{ scale: 0.9 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                            onClick={() => handleEdit(product)}
                                            className="p-2 text-foreground/60 hover:text-foreground bg-foreground/5 rounded-lg border border-card-border hover:border-foreground/40 transition-colors shadow-sm"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Framer Motion Shared Layout Modal for Add/Edit */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-card border border-card-border p-8 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-foreground/5 blur-[50px] pointer-events-none" />

                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <h2 className="text-xl font-bold text-foreground tracking-widest uppercase flex items-center gap-2">
                                    <PackageOpen className="w-5 h-5" />
                                    {editingId ? 'Modify Asset' : 'Inject New Asset'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-foreground/50 hover:text-foreground transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-5 relative z-10">
                                <div>
                                    <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Nomenclature</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-background border border-card-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Sector (Category)</label>
                                    <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-background border border-card-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" required />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Valuation (₹)</label>
                                        <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full bg-background border border-card-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-widest">Reserves (Stock)</label>
                                        <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })} className="w-full bg-background border border-card-border rounded-lg p-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono" required />
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                        type="submit"
                                        className="flex-1 bg-foreground text-background font-bold tracking-widest uppercase py-4 rounded-xl hover:bg-foreground/90 transition-colors shadow-lg border border-foreground/10"
                                    >
                                        {editingId ? 'Execute Update' : 'Initialize Asset'}
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
