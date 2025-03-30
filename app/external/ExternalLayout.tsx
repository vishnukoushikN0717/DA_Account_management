"use client";
import { MainNav } from "@/components/main-nav";
import { SidebarNav } from "@/components/external/side-bar";
import { useSidebar } from "@/hooks/use-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();
  return (
    <div className="flex flex-col h-screen">
      <MainNav />
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav />
        <main
          className={`flex-1 transition-all duration-300 ${
            isOpen ? "ml-52" : "ml-16"
          } mt-16 p-4 overflow-y-auto`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}