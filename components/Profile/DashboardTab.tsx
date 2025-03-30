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
  DollarSign,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock,
  UserCheck,
  Stethoscope,
  Building2,
  FileText
} from "lucide-react";
import { Practice } from "@/types/practice";

interface DashboardTabProps {
  practice: Practice;
}

const patientDistribution = [
  { name: "Active", value: 850 },
  { name: "Inactive", value: 250 },
  { name: "New", value: 150 },
];

const COLORS = ["#3B82F6", "#6B7280", "#10B981"];

export function DashboardTab({ practice }: DashboardTabProps) {
  // Calculate percentage changes (dummy data)
  const patientGrowth = 12.5;
  const revenueGrowth = 8.3;
  const practitionerGrowth = 15.0;
  const locationGrowth = 5.0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <p className="text-2xl font-bold">{practice.noOfPatients.toLocaleString()}</p>
          </div>
          <p className="text-sm text-gray-400">vs. previous month</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <span className={`flex items-center gap-1 text-sm ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {revenueGrowth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(revenueGrowth)}%
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-2xl font-bold">{practice.yearlyRevenue || "$0"}</p>
          </div>
          <p className="text-sm text-gray-400">vs. previous month</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Stethoscope className="h-6 w-6 text-purple-600" />
            </div>
            <span className={`flex items-center gap-1 text-sm ${practitionerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {practitionerGrowth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(practitionerGrowth)}%
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Practitioners</p>
            <p className="text-2xl font-bold">{practice.noOfPhysicians || 0}</p>
          </div>
          <p className="text-sm text-gray-400">vs. previous month</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building2 className="h-6 w-6 text-orange-600" />
            </div>
            <span className={`flex items-center gap-1 text-sm ${locationGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {locationGrowth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(locationGrowth)}%
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Locations</p>
            <p className="text-2xl font-bold">{practice.noOfLocations}</p>
          </div>
          <p className="text-sm text-gray-400">vs. previous month</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Patient Distribution</h3>
              <p className="text-sm text-gray-500">Current patient status</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
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
              <p className="text-sm text-gray-500">Latest practice updates</p>
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
                title: "New Patient Registration",
                description: "15 new patients registered",
                time: "2 hours ago"
              },
              {
                icon: FileText,
                color: "text-green-600",
                bg: "bg-green-100",
                title: "Medical Records Updated",
                description: "28 records were updated",
                time: "4 hours ago"
              },
              {
                icon: Calendar,
                color: "text-purple-600",
                bg: "bg-purple-100",
                title: "Appointments Scheduled",
                description: "32 new appointments",
                time: "6 hours ago"
              },
              {
                icon: Clock,
                color: "text-orange-600",
                bg: "bg-orange-100",
                title: "Average Wait Time",
                description: "Reduced by 15 minutes",
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