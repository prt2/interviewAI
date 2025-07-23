"use client";

import { auth, provider } from "@/lib/firebase/firebaseConfig";
import {
  User,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isLoadingUser: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * AuthProvider component that provides authentication context to its children.
 *
 * This component manages the authentication state of the user, including
 * signing in and signing out. It uses Firebase authentication methods
 * to handle user sessions and provides the current user and loading state
 * through the context.
 *
 * @param {React.ReactNode} children - The child components that will have access to the authentication context.
 *
 * @returns {JSX.Element} The AuthContext.Provider component with the authentication value.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const signIn = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error signing in:", errorMessage);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error signing out:", errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);
      setIsLoadingUser(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user: currentUser,
    isLoadingUser,
    signIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
