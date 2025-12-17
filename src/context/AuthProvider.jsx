import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return error;
  };

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };
  const updatePassword = async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    return error;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, signIn, signOut, updatePassword }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
