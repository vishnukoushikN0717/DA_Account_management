"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PencilIcon,
  EyeIcon,
  PlusCircleIcon,
  XCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeft,
  MoreVerticalIcon,
} from "lucide-react";

// Add Skeleton component
const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="p-1 w-[8%] min-w-[50px]">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="p-1 w-[25%] min-w-[150px]">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="p-1 w-[12%] min-w-[60px]">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="p-2 w-[25%] min-w-[100px]">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="p-2 w-[20%] min-w-[100px]">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="p-2.5 w-[10%] min-w-[70px]">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
    <td className="p-2.5 w-[10%] min-w-[70px]">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </td>
  </tr>
);

interface PracticeUser {
  id: string;
  name: string;
  npiNumber: string;
  entityWavId: string;
  driStatus: string;
  lifecycleStage: string;
  entitySubtype: string;
}

export default function PracticePage() {
  const router = useRouter();
  const [users, setUsers] = useState<PracticeUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [driStatus, setDriStatus] = useState("");
  const [lifecycleStage, setLifecycleStage] = useState("");
  const [practiceVertical, setPracticeVertical] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/entity/practice/getActivePracticeUsers", {
          headers: {
            accept: "*/*",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        
        const data = await response.json();
        
        const activeUsers = data.map((user: any) => ({
          id: user.id,
          name: user.name,
          npiNumber: user.entityNpiNumber,
          entityWavId: user.entityWavId,
          driStatus: "Created",
          lifecycleStage: user.lifecycleStage,
          entitySubtype: user.entitySubtype,
          clinicalServices: user.clinicalServices,
          services: user.services,
        }));
        
        setUsers(activeUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchMatch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.npiNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const driMatch = driStatus ? user.driStatus === driStatus : true;
    const lifecycleMatch = lifecycleStage ? user.lifecycleStage === lifecycleStage : true;
    const verticalMatch = practiceVertical ? user.entitySubtype === practiceVertical : true;
    return searchMatch && driMatch && lifecycleMatch && verticalMatch;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key as keyof PracticeUser] ?? '';
      const bValue = b[sortConfig.key as keyof PracticeUser] ?? '';
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const requestSort = (key: keyof PracticeUser) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof PracticeUser) => {
    return (
      <span className="inline-flex items-center ml-1">
        <ArrowUpIcon
          className={`h-3 w-3 ${
            sortConfig.key === key && sortConfig.direction === "ascending"
              ? "text-white"
              : "text-gray-400"
          }`}
        />
        <ArrowDownIcon
          className={`h-3 w-3 ${
            sortConfig.key === key && sortConfig.direction === "descending"
              ? "text-white"
              : "text-gray-400"
          }`}
        />
      </span>
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDriStatus("");
    setLifecycleStage("");
    setPracticeVertical("");
  };

  const toggleMenu = (userId: string) => {
    setMenuOpen(menuOpen === userId ? null : userId);
  };

  const handleMapClick = (practiceId: string) => {
    router.push(`/market-analysis/entities/practice/mapp?id=${practiceId}`);
    setMenuOpen(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-none">
        <div className="px-4 pt-1">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Practice Management
          </h1>
        </div>

        <div className="flex items-center justify-between gap-4 bg-background p-3 rounded-lg shadow-sm border mx-4 mt-1 mb-2">
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <Input
              placeholder="Search by Name or NPI Number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[250px] min-w-[150px]"
            />
            <Select value={driStatus} onValueChange={setDriStatus}>
              <SelectTrigger className="w-[150px] min-w-[120px]">
                <SelectValue placeholder="DRI" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={lifecycleStage} onValueChange={setLifecycleStage}>
              <SelectTrigger className="w-[150px] min-w-[120px]">
                <SelectValue placeholder="Lifecycle Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Untouched">Untouched</SelectItem>
                <SelectItem value="Targeted">Targeted</SelectItem>
                <SelectItem value="Engaged">Engaged</SelectItem>
                <SelectItem value="In Sale Cycle">In Sale Cycle</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Implementation">Implementation</SelectItem>
                <SelectItem value="HHAH Active">HHAH Active</SelectItem>
                <SelectItem value="HHAH+">HHAH+</SelectItem>
                <SelectItem value="Comprehensive">Comprehensive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={practiceVertical} onValueChange={setPracticeVertical}>
              <SelectTrigger className="w-[220px] min-w-[180px]">
                <SelectValue placeholder="Practice Vertical" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Independent Clinics">Independent Clinics</SelectItem>
                <SelectItem value="Health science center">Health Science Center</SelectItem>
                <SelectItem value="Hospitals">Hospitals</SelectItem>
                <SelectItem value="Medical center">Medical Center</SelectItem>
                <SelectItem value="Housecall">Housecall</SelectItem>
                <SelectItem value="Specialty Center">Specialty Center</SelectItem>
                <SelectItem value="Community health centers">Community Health Centers</SelectItem>
                <SelectItem value="Veteran Affairs">Veteran Affairs</SelectItem>
                <SelectItem value="Hospital based Groups">Hospital Based Groups</SelectItem>
                <SelectItem value="Multispecialty groups">Multispecialty Groups</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || driStatus || lifecycleStage || practiceVertical) && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="h-8"
              >
                <XCircleIcon className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/market-analysis/landing-page")}
              className="h-8"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-500 text-white h-8"
              onClick={() => router.push("/market-analysis/entities/practice/create")}
            >
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Create
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mx-4">
        <div className="w-full">
          <table className="w-full divide-y divide-border table-auto">
            <thead className="bg-gray-200 dark:bg-gray-800 sticky top-0">
              <tr>
                <th scope="col" className="p-2 text-gray-700 dark:text-gray-200 font-semibold text-left w-[8%] min-w-[50px]">
                  Sr No.
                </th>
                <th scope="col" className="p-2 text-gray-700 dark:text-gray-200 font-semibold cursor-pointer text-left w-[25%] min-w-[150px]" onClick={() => requestSort("name")}>
                  Name {getSortIcon("name")}
                </th>
                <th scope="col" className="p-2 text-gray-700 dark:text-gray-200 font-semibold cursor-pointer text-left w-[15%] min-w-[100px]" onClick={() => requestSort("npiNumber")}>
                  NPI Number {getSortIcon("npiNumber")}
                </th>
                <th scope="col" className="p-2 text-gray-700 dark:text-gray-200 font-semibold cursor-pointer text-left w-[12%] min-w-[60px]" onClick={() => requestSort("driStatus")}>
                  DRI {getSortIcon("driStatus")}
                </th>
                <th scope="col" className="p-2 text-gray-700 dark:text-gray-200 font-semibold cursor-pointer text-left w-[20%] min-w-[100px]" onClick={() => requestSort("lifecycleStage")}>
                  Lifecycle Stage {getSortIcon("lifecycleStage")}
                </th>
                <th scope="col" className="p-2 text-gray-700 dark:text-gray-200 font-semibold cursor-pointer text-left w-[20%] min-w-[100px]" onClick={() => requestSort("entitySubtype")}>
                  Practice Vertical {getSortIcon("entitySubtype")}
                </th>
                <th scope="col" className="p-2 text-gray-700 dark:text-gray-200 font-semibold text-center w-[12%] min-w-[70px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {isLoading ? (
                // Show 10 skeleton rows while loading
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-accent/50">
                    <td className="p-1 text-sm font-medium whitespace-nowrap w-[8%] min-w-[50px]">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="p-1 text-sm whitespace-nowrap w-[25%] min-w-[150px]">
                      {user.name}
                    </td>
                    <td className="p-1 text-sm whitespace-nowrap w-[15%] min-w-[100px]">
                      {user.npiNumber}
                    </td>
                    <td className="p-1 text-sm whitespace-nowrap w-[12%] min-w-[60px]">
                      <span
                        className={`px-1 py-0.5 rounded-full text-xs ${
                          user.driStatus === "Active"
                            ? "bg-green-100 text-green-800"
                            : user.driStatus === "Inactive"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.driStatus}
                      </span>
                    </td>
                    <td className="p-2 text-sm whitespace-nowrap w-[20%] min-w-[100px]">
                      {user.lifecycleStage}
                    </td>
                    <td className="p-2 text-sm whitespace-nowrap w-[20%] min-w-[100px]">
                      {user.entitySubtype}
                    </td>
                    <td className="p-2.5 text-sm whitespace-nowrap w-[12%] min-w-[70px] relative">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:text-blue-600 hover:bg-blue-100/50 dark:hover:bg-blue-900/50"
                          onClick={() => router.push(`/market-analysis/entities/practice/edit/${user.id}`)}
                        >
                          <PencilIcon className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:text-blue-600 hover:bg-blue-100/50 dark:hover:bg-blue-900/50"
                          onClick={() => router.push(`/market-analysis/entities/practice/profile/${user.id}`)}
                        >
                          <EyeIcon className="h-3 w-3" />
                        </Button>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:text-blue-600 hover:bg-blue-100/50 dark:hover:bg-blue-900/50"
                            onClick={() => toggleMenu(user.id)}
                          >
                            <MoreVerticalIcon className="h-3 w-3" />
                          </Button>
                          {menuOpen === user.id && (
                            <div className="absolute right-0 mt-1 w-24 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => handleMapClick(user.id)}
                              >
                                Map
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex-none mt-3 mx-4">
        <div className="flex items-center justify-between gap-4 bg-background p-4 rounded-lg shadow-sm border">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-[100px] h-8">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="h-8"
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                className={`${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : ""
                } h-8`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="h-8"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}