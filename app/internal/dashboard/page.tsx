"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ExternalLayout from "../InternalLayout"; // Adjust the path as necessary

const data_bar = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 700 },
];

const lineData = [
  { name: "Week 1", views: 500, engagement: 300 },
  { name: "Week 2", views: 600, engagement: 400 },
  { name: "Week 3", views: 800, engagement: 500 },
  { name: "Week 4", views: 1200, engagement: 600 },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [barChartData] = useState(data_bar);
  const [lineChartData] = useState(lineData);
  const router = useRouter();

  // Ensure we're rendering on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Add console logs to debug data
  // console.log('Bar Chart Data:', data_bar);
  // console.log('Line Chart Data:', lineData);

  // Add logout handler
  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.clear();

      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Redirect to login page
      router.push("/auth/otp-login");
      
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <ExternalLayout>
      {/* Your dashboard content goes here */}
      <h1 className="text-3xl font-semibold">Dashboard Content</h1>
      {/* Other components */}
    </ExternalLayout>
  );
}