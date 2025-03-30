"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // Import useSession from NextAuth
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  Settings,
  User,
  Youtube,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "next-auth/react"; // Import signOut for logout

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
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session data and status
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [barChartData] = useState(data_bar);
  const [lineChartData] = useState(lineData);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    // Use NextAuth's signOut to clear session
    await signOut({ redirect: false });
    // Clear any localStorage items if necessary
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Clear any custom cookies if used
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/auth/otp-login");
  };

  // Check userRole from session
  const userRole = session?.user?.userRole;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2 px-4">
            <span className="text-xl font-bold">WAV</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform border-r bg-background transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="space-y-2 p-4">
          <Button
            variant="ghost"
            className="w-full justify-start hover:text-blue-600"
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start hover:text-blue-600"
          >
            Entity Creation
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start hover:text-blue-600"
          >
            Patient Manager
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start hover:text-blue-600"
            onClick={() => router.push("/market-analysis/landing-page")}
          >
            Market Analysis
          </Button>
          {/* Conditionally render Account button based on userRole from session */}
          {status === "authenticated" && userRole === "Super Admin" && (
            <Button
              variant="ghost"
              className="w-full justify-start hover:text-blue-600"
              onClick={() => router.push("/internal/user")}
            >
              Account
            </Button>
          )}
        </nav>

        {/* Logout Button at bottom */}
        <div className="absolute bottom-4 left-0 w-full px-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-margin duration-200 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="container p-6">
          <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <Card className="border-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Patients
                </CardTitle>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">45.2K</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card className="border-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Billability Rates
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">2.4K</div>
                <p className="text-xs text-muted-foreground">
                  Hours watched this month
                </p>
              </CardContent>
            </Card>
            <Card className="border-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenue Pipeline
                </CardTitle>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">12.5K</div>
                <p className="text-xs text-muted-foreground">
                  +2.5K this month
                </p>
              </CardContent>
            </Card>
            <Card className="border-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Engagement
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">24.3%</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Views Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {isClient && (
                  <div
                    style={{
                      width: "100%",
                      height: "300px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0284c7" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {isClient && (
                  <div
                    style={{
                      width: "100%",
                      height: "300px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={lineChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="#0284c7"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="engagement"
                          stroke="#94a3b8"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}