import React, { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AuthContext, User } from './AuthContextType';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser);
      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || undefined,
          isGuest: false
        };
        console.log('Setting user data:', userData);
        setUser(userData);
      } else {
        console.log('No firebase user, setting user to null');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists() && userCredential.user.email) {
        // Create user document in Firestore
        await setDoc(userDocRef, {
          email: userCredential.user.email,
          name: userCredential.user.displayName || userCredential.user.email.split('@')[0],
          isAdmin: false, // Default to false, can be manually updated in Firebase console
          createdAt: new Date().toISOString()
        });
      }
      
      const userData: User = {
        id: userCredential.user.uid,
        name: userCredential.user.displayName || email.split('@')[0],
        email: userCredential.user.email || undefined,
        isGuest: false
      };
      setUser(userData);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Create user document in Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        email,
        name,
        isAdmin: false, // Default to false, can be manually updated in Firebase console
        createdAt: new Date().toISOString()
      });
      
      const userData: User = {
        id: userCredential.user.uid,
        name,
        email,
        isGuest: false
      };
      setUser(userData);
    } finally {
      setLoading(false);
    }
  };

  const guestLogin = (name: string) => {
    const userData: User = {
      id: `guest_${Date.now()}`,
      name,
      isGuest: true
    };
    setUser(userData);
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      guestLogin,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
