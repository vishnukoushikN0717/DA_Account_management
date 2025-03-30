"use client";

import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  Users,
  Activity,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  UserCheck,
  Stethoscope,
  Building2,
  FileText
} from "lucide-react";
import { Practitioner } from "@/types/practitioner";

interface DashboardTabProps {
  practitioner: Practitioner;
}

// Dummy data for charts
const patientTrends = [
  { month: "Jan", patients: 120 },
  { month: "Feb", patients: 150 },
  { month: "Mar", patients: 180 },
  { month: "Apr", patients: 220 },
  { month: "May", patients: 250 },
  { month: "Jun", patients: 280 },
];

const orderData = [
  { month: "Jan", orders: 45 },
  { month: "Feb", orders: 52 },
  { month: "Mar", orders: 61 },
  { month: "Apr", orders: 58 },
  { month: "May", orders: 65 },
  { month: "Jun", orders: 72 },
];

const patientDistribution = [
  { name: "Active", value: 65 },
  { name: "Inactive", value: 25 },
  { name: "New", value: 10 },
];

const COLORS = ["#3B82F6", "#6B7280", "#10B981"];

export function DashboardTab({ practitioner }: DashboardTabProps) {
  // Calculate percentage changes (dummy data)
  const patientGrowth = 15.2;
  const orderGrowth = 8.7;
  const practiceGrowth = 12.5;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className={`flex items-center gap-1 text-sm ${patientGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {patientGrowth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(patientGrowth)}%
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Patients</p>
            <p className="text-2xl font-bold">{practitioner.noOfTotalPatients}</p>
          </div>
          <p className="text-sm text-gray-400">vs. previous month</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <span className={`flex items-center gap-1 text-sm ${orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {orderGrowth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(orderGrowth)}%
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Orders</p>
            <p className="text-2xl font-bold">{practitioner.noOfPendingOrders}</p>
          </div>
          <p className="text-sm text-gray-400">vs. previous month</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <span className={`flex items-center gap-1 text-sm ${practiceGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {practiceGrowth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(practiceGrowth)}%
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Associated Practices</p>
            <p className="text-2xl font-bold">{practitioner.noOfPracticesAssociated}</p>
          </div>
          <p className="text-sm text-gray-400">vs. previous month</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Patient Trends</h3>
              <p className="text-sm text-gray-500">6-month patient growth</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patientTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="patients" stroke="#3B82F6" strokeWidth={2} name="Total Patients" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Order Activity</h3>
              <p className="text-sm text-gray-500">Monthly order trends</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#8B5CF6" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Patient Distribution</h3>
              <p className="text-sm text-gray-500">Current patient status</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {patientDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <p className="text-sm text-gray-500">Latest updates</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div className="space-y-4">
            {[
              {
                icon: UserCheck,
                color: "text-blue-600",
                bg: "bg-blue-100",
                title: "New Patient Assignment",
                description: "5 new patients assigned",
                time: "2 hours ago"
              },
              {
                icon: FileText,
                color: "text-green-600",
                bg: "bg-green-100",
                title: "Orders Updated",
                description: "12 orders processed",
                time: "4 hours ago"
              },
              {
                icon: Building2,
                color: "text-purple-600",
                bg: "bg-purple-100",
                title: "Practice Association",
                description: "New practice linked",
                time: "6 hours ago"
              },
              {
                icon: Clock,
                color: "text-orange-600",
                bg: "bg-orange-100",
                title: "Schedule Update",
                description: "Calendar updated for next week",
                time: "12 hours ago"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`p-2 ${item.bg} rounded-lg`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <span className="text-xs text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}