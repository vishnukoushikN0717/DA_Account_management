"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  PlusCircleIcon,
  XCircleIcon,
  PencilIcon,
  EyeIcon,
  MailIcon,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTheme } from "next-themes"; // Import useTheme hook
import CustomTable from "../../components/table/tableComponent"; // Adjust the path as needed

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  userRole: string;
  regionAllocated: string;
  onboarderStatus: boolean;
  lastLogin: string;
}

export function InternalAccounts() {
  const router = useRouter();
  const { theme } = useTheme(); // Get the current theme
  const [searchTerm, setSearchTerm] = useState("");
  const [userLevel, setUserLevel] = useState("");
  const [invitationSentEmail, setInvitationSentEmail] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState<string | null>(null);
  const [forceRefresh, setForceRefresh] = useState(0);

  const getAccountOwnerName = (user: User) => {
    if (user.firstName === "string" || !user.firstName || !user.lastName) {
      return user.email;
    }
    if (user.firstName !== "string" && user.lastName !== "string") {
      return `${user.firstName} ${user.lastName}`.trim();
    }
    return user.email;
  };

  const handleSendInvitation = async (email: string) => {
    setIsInviting(email);
    try {
      const response = await fetch('/api/AccountManager/WAVInternalUser/send-invitation', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(email),
      });

      if (!response.ok) {
        throw new Error('Failed to send invitation');
      }

      setInvitationSentEmail(email);
      setForceRefresh(prev => prev + 1);

      setTimeout(() => {
        setInvitationSentEmail(null);
      }, 3000);

      toast.success("Invitation Sent", {
        description: `Invitation has been sent to ${email}`,
        duration: 2000,
      });
    } catch (error) {
      toast.error("Failed to Send Invitation", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsInviting(null);
    }
  };

  // Define the fetch function that will be passed to CustomTable
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/AccountManager/WAVInternalUser', {
        method: 'GET',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();

      // Filter the data based on search criteria 
      return data.filter((user: User) => {
        const nameMatch =
          (user.firstName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const roleMatch = !userLevel ||
          user.userRole?.toLowerCase() === userLevel.toLowerCase();

        return nameMatch && roleMatch;
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }, [searchTerm, userLevel]);

  // Define columns for the CustomTable
  const columns = [
    {
      key: "srNo",
      header: "Sr No.",
      width: "8%",
      render: (_item: User, index: number) => index,
    },
    {
      key: "firstName",
      header: "Account Owner",
      width: "20%",
      render: (item: User) => (
        <span className="text-blue-500">
          {getAccountOwnerName(item)}
        </span>
      ),
    },
    {
      key: "userRole",
      header: "Account Type",
      width: "18%",
    },
    {
      key: "regionAllocated",
      header: "Region",
      width: "15%",
      render: (item: User) => item.regionAllocated || "N/A",
    },
    {
      key: "onboarderStatus",
      header: "Account Status",
      width: "15%",
      render: (item: User) => (
        <span className={`px-2 py-1 rounded-full text-xs ${item.onboarderStatus
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
          }`}>
          {item.onboarderStatus ? 'Onboarded' : 'Invited'}
        </span>
      ),
    },
    {
      key: "lastLogin",
      header: "Last Login",
      width: "15%",
      render: (item: User) => item.lastLogin || "N/A",
    },
    {
      key: "actions",
      header: "Action",
      width: "9%",
      render: (item: User) => (
        <div className="flex items-center justify-end gap-1">
          {invitationSentEmail === item.email ? (
            <span className="text-green-600">✓ Sent</span>
          ) : isInviting === item.email ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className={`h-7 w-7 hover:text-blue-600 ${theme === 'dark' ? 'hover:bg-blue-900/50' : 'hover:bg-blue-100/50'}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSendInvitation(item.email);
              }}
            >
              <MailIcon className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 hover:text-blue-600 ${theme === 'dark' ? 'hover:bg-blue-900/50' : 'hover:bg-blue-100/50'}`}
            onClick={(e) => {
              e.stopPropagation();
              // Set preference before navigating
              localStorage.setItem("accountTabPreference", "internal");
              router.push(`/internal/dashboard/edit-internal-profile/${encodeURIComponent(item.id)}`);
            }}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 hover:text-blue-600 ${theme === 'dark' ? 'hover:bg-blue-900/50' : 'hover:bg-blue-100/50'}`}
            onClick={(e) => {
              e.stopPropagation();
              // Set preference before navigating
              localStorage.setItem("accountTabPreference", "internal");
              router.push(`/internal/dashboard/internal-profile/${encodeURIComponent(item.id)}`);
            }}
          >
            <EyeIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Force refresh the data when filters change
  useEffect(() => {
    setForceRefresh(prev => prev + 1);
  }, [searchTerm, userLevel]);

  // Determine the current theme for the CustomTable
  const currentTheme = theme === 'dark' ? 'dark' : 'light';

  return (
    // Removed the fixed height and overflow-x-hidden that was causing the right scrollbar
    <div className="flex flex-col w-full">
      {/* Fixed Header */}
      <div className="w-full">
        {/* Fixed Filters and Actions */}
        <div className={`flex items-center justify-between gap-4 p-3 rounded-lg shadow-md border mb-4 ${theme === 'dark'
          ? 'bg-gray-900 border-gray-700'
          : 'bg-white border-gray-200'
          }`}>
          <div className="flex items-center gap-4 flex-1">
            <Input
              placeholder="Search by Name or Email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-[300px] ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-400'
                : 'bg-white border-gray-300'
                }`}
            />
            <Select value={userLevel} onValueChange={setUserLevel}>
              <SelectTrigger className={`w-[180px] ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300'
                }`}>
                <SelectValue placeholder="User Level" />
              </SelectTrigger>
              <SelectContent className={
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300'
              }>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Internal User">Internal User</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || userLevel) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setUserLevel("");
                }}
                className={
                  theme === 'dark'
                    ? 'border-gray-700 text-white hover:bg-gray-800'
                    : 'border-gray-300 hover:bg-gray-100'
                }
              >
                <XCircleIcon className="h-4 w-4 mr-2" />
                Clear Filter
              </Button>
            )}
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-500 text-white"
            onClick={() => {
              // Set preference before navigating
              localStorage.setItem("accountTabPreference", "internal");
              router.push("/internal/dashboard/createInternal");
            }}
          >
            <PlusCircleIcon className="h-4 w-4 mr-2" />
            Create Internal Account
          </Button>
        </div>
      </div>

      {/* CustomTable Component with theme support */}
      <div className="w-full overflow-hidden">
        <CustomTable
          columns={columns}
          fetchData={fetchUsers}
          initialSortKey="firstName"
          initialSortDirection="ascending"
          itemsPerPageOptions={[10, 20, 50, 100]}
          theme={currentTheme}
          key={forceRefresh}
        />
      </div>
    </div>
  );
}