import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { getCurrentUser } from "@/lib/api";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo = "/",
}) {
  const location = useLocation();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const data = await getCurrentUser();
        const currentUser = data.user;

        if (!isMounted) return;

        if (!currentUser) {
          setStatus("unauthenticated");
          return;
        }

        const roleIsAllowed =
          allowedRoles.length === 0 || allowedRoles.includes(currentUser.role);

        if (!roleIsAllowed) {
          setStatus("forbidden");
          return;
        }

        setStatus("authenticated");
      } catch (error) {
        if (!isMounted) return;
        setStatus("unauthenticated");
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [allowedRoles.join("|")]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <div className="mx-auto max-w-[1500px] px-8 py-8">
          <div className="rounded-[2rem] border border-white/[0.08] bg-[#0b0d12] p-8 text-white/50">
            Checking access...
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || status === "forbidden") {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
}