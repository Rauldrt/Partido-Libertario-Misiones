
"use client";

import React, { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type Auth,
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const firebaseAuth = getFirebaseAuth();
    if (firebaseAuth) {
        setAuth(firebaseAuth);
        const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    } else {
        // Firebase is not initialized, maybe because env vars are missing
        setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Firebase Auth not initialized.");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!auth) throw new Error("Firebase Auth not initialized.");
    await signOut(auth);
  };

  const value = { user, loading, login, logout };

  // Render a full-page loader while the auth state is being determined.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
