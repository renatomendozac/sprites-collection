import React, { useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "./supabaseClient";
import html2canvas from "html2canvas";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

export default function App() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loadingSession) {
    return <div className="loading-msg mono">// Cargando sesión…</div>;
  }

  return <Dashboard session={session} />;
}
