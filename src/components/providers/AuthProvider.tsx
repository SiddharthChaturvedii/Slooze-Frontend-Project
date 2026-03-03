"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export type Role = "MANAGER" | "STORE_KEEPER";

export interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User, token: string, skipRedirect?: boolean) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Load user from local storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("slooze_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }
    }, []);

    const login = (userData: User, token: string, skipRedirect?: boolean) => {
        setUser(userData);
        localStorage.setItem("slooze_user", JSON.stringify(userData));
        localStorage.setItem("slooze_token", token);

        if (!skipRedirect) {
            // Redirect based on role
            if (userData.role === "MANAGER") {
                router.push("/dashboard");
            } else {
                router.push("/products");
            }
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("slooze_user");
        localStorage.removeItem("slooze_token");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
