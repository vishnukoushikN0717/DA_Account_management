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
  Building2,
  FileText,
  Network,
  Mail,
  Phone
} from "lucide-react";
import { Contact } from "@/types/contact";

interface DashboardTabProps {
  contact: Contact;
}

// Dummy data for charts
const interactionTrends = [
  { month: "Jan", interactions: 45 },
  { month: "Feb", interactions: 52 },
  { month: "Mar", interactions: 61 },
  { month: "Apr", interactions: 58 },
  { month: "May", interactions: 65 },
  { month: "Jun", interactions: 72 },
];

const communicationData = [
  { month: "Jan", emails: 25, calls: 15 },
  { month: "Feb", emails: 30, calls: 18 },
  { month: "Mar", emails: 35, calls: 22 },
  { month: "Apr", emails: 28, calls: 20 },
  { month: "May", emails: 32, calls: 25 },
  { month: "Jun", emails: 38, calls: 28 },
];

const engagementDistribution = [
  { name: "High", value: 45 },
  { name: "Medium", value: 35 },
  { name: "Low", value: 20 },
];

const COLORS = ["#3B82F6", "#6B7280", "#10B981"];

export function DashboardTab({ contact }: DashboardTabProps) {
  // Calculate percentage changes (dummy data)
  const interactionGrowth = 15.2;
  const communicationGrowth = 8.7;
  const engagementGrowth = 12.5;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <span className={`flex items-center gap-1 text-sm ${interactionGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {interactionGrowth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(interactionGrowth)}%
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Interactions</p>
            <p className="text-2xl font-bold">321</p>
          </div>
          <p className="text-sm text-gray-400">vs. previous month</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
            <span className={`flex items-center gap-1 text-sm ${communicationGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {communicationGrowth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(communicationGrowth)}%
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email Communications</p>
            <p className="text-2xl font-bold">188</p>
          </div>
          <p className="text-sm text-gray-400">vs. previous month</p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-100 rounded-lg">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <span className={`flex items-center gap-1 text-sm ${engagementGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {engagementGrowth >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(engagementGrowth)}%
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone Interactions</p>
            <p className="text-2xl font-bold">128</p>
          </div>
          <p className="text-sm text-gray-400">vs. previous month</p>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Interaction Trends</h3>
              <p className="text-sm text-gray-500">6-month interaction history</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={interactionTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="interactions" stroke="#3B82F6" strokeWidth={2} name="Total Interactions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Communication Analysis</h3>
              <p className="text-sm text-gray-500">Email vs Phone interactions</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Network className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={communicationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="emails" fill="#8B5CF6" name="Emails" />
                <Bar dataKey="calls" fill="#10B981" name="Phone Calls" />
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
              <h3 className="text-lg font-semibold">Engagement Level</h3>
              <p className="text-sm text-gray-500">Contact engagement distribution</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={engagementDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {engagementDistribution.map((entry, index) => (
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
              <p className="text-sm text-gray-500">Latest interactions</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div className="space-y-4">
            {[
              {
                icon: Mail,
                color: "text-blue-600",
                bg: "bg-blue-100",
                title: "Email Communication",
                description: "Follow-up email sent",
                time: "2 hours ago"
              },
              {
                icon: Phone,
                color: "text-green-600",
                bg: "bg-green-100",
                title: "Phone Call",
                description: "15-minute discussion",
                time: "4 hours ago"
              },
              {
                icon: Calendar,
                color: "text-purple-600",
                bg: "bg-purple-100",
                title: "Meeting Scheduled",
                description: "Quarterly review meeting",
                time: "6 hours ago"
              },
              {
                icon: FileText,
                color: "text-orange-600",
                bg: "bg-orange-100",
                title: "Document Shared",
                description: "Sent project proposal",
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