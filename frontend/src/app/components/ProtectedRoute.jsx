import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabaseClient";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    getSession();

    // Listen for auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>; // or <Loader />

  // If not logged in → redirect to sign-in page
  if (!session) return <Navigate to="/signin" />;

  // Otherwise → render the protected page
  return children;
}

export default ProtectedRoute;