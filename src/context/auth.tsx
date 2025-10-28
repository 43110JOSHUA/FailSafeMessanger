"use client";

import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/client";
import type { User as AppUser } from "../lib/types";

type AuthContextType = {
  // Firebase auth
  user: User | null;
  currentUser: User | null; // Keep for backward compatibility
  // Database user
  dbUser: AppUser | null;
  // Auth functions
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Firebase auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // Database user state
  const [dbUser, setDbUser] = useState<AppUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user ?? null);
      
      // Fetch database user when Firebase user changes
      if (user) {
        try {
          // Save/update user to database
          const { addUser, getUserById } = await import("../lib/actions");
          await addUser({
            id: user.uid,
            email: user.email!,
            name: user.displayName || undefined,
          });

          // Fetch complete user data from database
          const databaseUser = await getUserById(user.uid);
          setDbUser(databaseUser);
        } catch (error) {
          console.error("Failed to save/fetch user from database:", error);
          setDbUser(null);
        }
      }
  
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <AuthContext.Provider
      value={{
        // Firebase auth
        user: currentUser,
        currentUser,
        dbUser,
        logout,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
