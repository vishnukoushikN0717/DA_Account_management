"use client";

import { MainNav } from "@/components/main-nav";
import { SidebarNav } from "@/components/internal/sidebar-nav";
import { useSidebar } from "@/hooks/use-sidebar";
import { SessionProvider, useSession } from "next-auth/react"; // Import useSession
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();
  const { data: session, status } = useSession(); // Fetch session data

//   const { data: session, status } = useSession({
//     required: false, // Don't redirect if unauthenticated (handled by middleware)
//     refetchInterval: 0, // Disable periodic refetching
//     refetchOnWindowFocus: false, // Disable refetch on window focus
//   });
//   const { data: session, status } = useSession({
//     required: false, // Don't redirect if unauthenticated (handled by middleware)
//     refetchOnWindowFocus: false, // Prevent refetching on window focus
//   });
  const [userRole, setUserRole] = useState<string | null>(null); // Store userRole

  // Fetch userRole once when the session is loaded
  useEffect(() => {
    console.log("useEffect in DashboardLayout running...");
    if (status === "authenticated" && session?.user?.userRole) {
      setUserRole(session.user.userRole);
    }
  }, [status, session]);

  // Handle loading state
  if (status === "loading") {
    return (
      <div className="flex flex-col h-screen">
        <MainNav />
        <div className="flex flex-1 items-center justify-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <MainNav />
      <div className="flex flex-1 overflow-hidden">
        <SessionProvider>
          {/* Pass userRole as a prop to SidebarNav */}
          <SidebarNav userRole={userRole} />
          <main
            className={`flex-1 transition-all duration-300 ${
              isOpen ? "ml-52" : "ml-16"
            } mt-16 p-4 overflow-y-auto`}
          >
            {children}
          </main>
        </SessionProvider>
      </div>
    </div>
  );
}