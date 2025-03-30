"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDownIcon, Users, UserCheck, CheckCircle, DollarSign } from "lucide-react";
import DashboardLayout from "../ExternalLayout";
import { useSession } from "next-auth/react";

interface Patient {
  id: string;
  name: string;
  mrn: string;
  patientStatus: string;
  billingProvider: string;
  practice: string;
  startOfEpisode: string;
  episodeDaysRemaining: number;
  ordersSigned: number;
  ordersTotal: number;
}

interface ApiPatient {
  id: string;
  agencyInfo: {
    patientFName: string;
    patientMName: string | null;
    patientLName: string;
    medicalRecordNo: string;
    patientStatus: string;
    billingProvider: string;
    physicianGroup: string;
    startOfEpisode: string | null;
    episodeDaysLeft: number | null;
    signedOrders: number | null;
    totalOrders: number | null;
  };
}

interface StatsData {
  totalPatientsWithWAVId: number;
  totalWithPatientStatusActive: number;
  totalEligible: number;
  totalBillable: number;
}

// Function to format date to "Month DD, YYYY"
const formatDate = (dateString: string | null) => {
  if (!dateString || dateString === "N/A") return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

// Function to format date for input (MM-DD-YYYY)
const formatDateForInput = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

const PatientsPageContent: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [soeFromDate, setSoeFromDate] = useState("");
  const [soeToDate, setSoeToDate] = useState("");
  const [patientStatus, setPatientStatus] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    activePatients: 0,
    eligiblePatients: 0,
    readyToBill: 0,
  });

  // Fetch stats data
  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.companyId) return;
      try {
        const companyId = session.user.companyId;
        const response = await fetch(
          `https://dawavorderpatient-hqe2apddbje9gte0.eastus-01.azurewebsites.net/api/Patient/agencycount?companyId=${companyId}`,
          {
            method: "GET",
            headers: { Accept: "*/*" },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch stats");

        const data: StatsData = await response.json();
        
        setStats({
          totalPatients: data.totalPatientsWithWAVId,
          activePatients: data.totalWithPatientStatusActive,
          eligiblePatients: data.totalEligible,
          readyToBill: data.totalBillable,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({
          totalPatients: 0,
          activePatients: 0,
          eligiblePatients: 0,
          readyToBill: 0,
        });
      }
    };

    fetchStats();
  }, [session]);

  // Fetch patients data
  useEffect(() => {
    const fetchPatients = async () => {
      if (!session?.user?.companyId) return;
      setIsLoading(true);
      try {
        const companyId = session.user.companyId;
        const response = await fetch(
          `https://dawavorderpatient-hqe2apddbje9gte0.eastus-01.azurewebsites.net/api/Patient/company/${companyId}`,
          {
            method: "GET",
            headers: { Accept: "*/*" },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch patients");

        const data: ApiPatient[] = await response.json();

        const mappedPatients: Patient[] = data.map((patient) => ({
          id: patient.id,
          name: `${patient.agencyInfo.patientFName} ${patient.agencyInfo.patientMName || ""} ${patient.agencyInfo.patientLName}`.trim(),
          mrn: patient.agencyInfo.medicalRecordNo || "N/A",
          patientStatus: patient.agencyInfo.patientStatus || "Unknown",
          billingProvider: patient.agencyInfo.billingProvider || "N/A",
          practice: patient.agencyInfo.physicianGroup || "N/A",
          startOfEpisode: patient.agencyInfo.startOfEpisode || "N/A",
          episodeDaysRemaining: patient.agencyInfo.episodeDaysLeft ?? 0,
          ordersSigned: patient.agencyInfo.signedOrders ?? 0,
          ordersTotal: patient.agencyInfo.totalOrders ?? 0,
        }));

        setPatients(mappedPatients);
        setFilteredPatients(mappedPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setPatients([]);
        setFilteredPatients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [session]);

  // Filter and sort patients
  useEffect(() => {
    let filtered = [...patients];

    if (searchTerm) {
      filtered = filtered.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.billingProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.practice.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (patientStatus) {
      filtered = filtered.filter((patient) => patient.patientStatus === patientStatus);
    }

    if (soeFromDate || soeToDate) {
      filtered = filtered.filter((patient) => {
        const startDate = patient.startOfEpisode !== "N/A" ? new Date(patient.startOfEpisode) : null;
        const fromDate = soeFromDate ? new Date(soeFromDate.split('-').join('-')) : null;
        const toDate = soeToDate ? new Date(soeToDate.split('-').join('-')) : null;
        return (
          (!fromDate || (startDate && startDate >= fromDate)) &&
          (!toDate || (startDate && startDate <= toDate))
        );
      });
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const key = sortConfig.key as keyof Patient | "episodeDaysRemaining" | "ordersSigned";
        let aValue, bValue;
        if (key === "episodeDaysRemaining") {
          aValue = a.episodeDaysRemaining;
          bValue = b.episodeDaysRemaining;
        } else if (key === "ordersSigned") {
          aValue = a.ordersSigned;
          bValue = b.ordersSigned;
        } else {
          aValue = a[key as keyof Patient] ?? "";
          bValue = b[key as keyof Patient] ?? "";
        }
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    setFilteredPatients(filtered);
    setCurrentPage(1);
  }, [patients, searchTerm, patientStatus, soeFromDate, soeToDate, sortConfig]);

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;

  const requestSort = (key: keyof Patient | "episodeDaysRemaining" | "ordersSigned") => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Patient | "episodeDaysRemaining" | "ordersSigned") => (
    <ArrowUpDownIcon
      className={`h-4 w-4 ml-1 inline transition-transform duration-200 ${
        sortConfig.key === key
          ? sortConfig.direction === "ascending"
            ? "text-blue-600 rotate-0"
            : "text-blue-600 rotate-180"
          : "text-gray-400 hover:text-gray-600"
      }`}
    />
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSoeFromDate("");
    setSoeToDate("");
    setPatientStatus("");
    setSortConfig({ key: "", direction: "" });
  };

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleRowClick = (patientId: string) => {
    router.push(`/external/patients/${patientId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col h-full px-4 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-600" />
          Patients ({stats.totalPatients})
        </h1>
        <div className="grid grid-cols-4 gap-3 mt-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-md border border-blue-200 dark:border-blue-800 transition-all hover:shadow-lg min-h-[90px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-full">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300">Total</h3>
                <p className="text-xs text-gray-900 dark:text-gray-200 mt-1">All Patients</p>
              </div>
            </div>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{stats.totalPatients}</p>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg shadow-md border border-orange-200 dark:border-orange-800 transition-all hover:shadow-lg min-h-[90px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-800/50 rounded-full">
                <UserCheck className="h-5 w-5 text-orange-600 dark:text-orange-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-orange-700 dark:text-orange-300">Active</h3>
                <p className="text-xs text-gray-900 dark:text-gray-200 mt-1">Ongoing Episode</p>
              </div>
            </div>
            <p className="text-xl font-bold text-orange-700 dark:text-orange-300">{stats.activePatients}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg shadow-md border border-purple-200 dark:border-purple-800 transition-all hover:shadow-lg min-h-[90px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-full">
                <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-300">Eligible</h3>
                <p className="text-xs text-gray-900 dark:text-gray-200 mt-1">
                  <span className="text-green-600 dark:text-green-400">✓</span> Valid 485 Cert
                </p>
                <p className="text-xs text-gray-900 dark:text-gray-200">
                  <span className="text-green-600 dark:text-green-400">✓</span> Valid F2F
                </p>
              </div>
            </div>
            <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{stats.eligiblePatients}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg shadow-md border border-green-200 dark:border-green-800 transition-all hover:shadow-lg min-h-[90px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-green-700 dark:text-green-300">Billable</h3>
                <p className="text-xs text-gray-900 dark:text-gray-200 mt-1">
                  <span className="text-green-600 dark:text-green-400">✓</span> Eligible
                </p>
                <p className="text-xs text-gray-900 dark:text-gray-200">
                  <span className="text-green-600 dark:text-green-400">✓</span> All Orders Signed
                </p>
              </div>
            </div>
            <p className="text-xl font-bold text-green-700 dark:text-green-300">{stats.readyToBill}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-3 mb-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by Name, MRN, Billing Provider or Practice"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-96 h-9 text-sm border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Select value={patientStatus} onValueChange={setPatientStatus}>
            <SelectTrigger className="w-40 h-9 text-sm border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Patient Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Eligible">Eligible</SelectItem>
              <SelectItem value="Billable">Billable</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Episode From:</span>
          <Input
            type="date"
            value={soeFromDate}
            onChange={(e) => setSoeFromDate(e.target.value)}
            placeholder="MM-DD-YYYY"
            className="w-40 h-9 text-sm border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">To:</span>
          <Input
            type="date"
            value={soeToDate}
            onChange={(e) => setSoeToDate(e.target.value)}
            placeholder="MM-DD-YYYY"
            className="w-40 h-9 text-sm border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {(searchTerm || soeFromDate || soeToDate || patientStatus) && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="h-9 text-sm px-3 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="w-full min-w-[1000px] overflow-y-auto" style={{ maxHeight: "calc(95vh - 350px)" }}>
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-600">
              <tr className="h-12">
                <th
                  className="p-2 pl-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 w-[18%] whitespace-nowrap cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => requestSort("name")}
                >
                  Patient Name {getSortIcon("name")}
                </th>
                <th
                  className="p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 w-[12%] whitespace-nowrap cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => requestSort("mrn")}
                >
                  MRN {getSortIcon("mrn")}
                </th>
                <th
                  className="p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 w-[12%] whitespace-nowrap cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => requestSort("patientStatus")}
                >
                  Patient Status {getSortIcon("patientStatus")}
                </th>
                <th
                  className="p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 w-[15%] whitespace-nowrap cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => requestSort("billingProvider")}
                >
                  Billing Provider {getSortIcon("billingProvider")}
                </th>
                <th
                  className="p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 w-[15%] whitespace-nowrap cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => requestSort("practice")}
                >
                  Practice {getSortIcon("practice")}
                </th>
                <th
                  className="p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 w-[12%] whitespace-nowrap cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => requestSort("startOfEpisode")}
                >
                  Start of Episode {getSortIcon("startOfEpisode")}
                </th>
                <th
                  className="p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 w-[12%] whitespace-nowrap cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => requestSort("episodeDaysRemaining")}
                >
                  Episode Days Left {getSortIcon("episodeDaysRemaining")}
                </th>
                <th
                  className="p-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 w-[12%] whitespace-nowrap cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => requestSort("ordersSigned")}
                >
                  Orders (Signed/Total) {getSortIcon("ordersSigned")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="p-2"><div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32"></div></td>
                    <td className="p-2"><div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20"></div></td>
                    <td className="p-2"><div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div></td>
                    <td className="p-2"><div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-28"></div></td>
                    <td className="p-2"><div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-28"></div></td>
                    <td className="p-2"><div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div></td>
                    <td className="p-2"><div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20"></div></td>
                    <td className="p-2"><div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24"></div></td>
                  </tr>
                ))
              ) : paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                    {patients.length === 0 ? "No patients found" : "No matching patients"}
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(patient.id)}
                  >
                    <td className="p-2 text-sm text-gray-700 dark:text-gray-200 font-medium">{patient.name}</td>
                    <td className="p-2 text-sm text-gray-700 dark:text-gray-200">{patient.mrn}</td>
                    <td className="p-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          patient.patientStatus === "Active"
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                            : patient.patientStatus === "Inactive"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : patient.patientStatus === "Eligible"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                            : patient.patientStatus === "Billable"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {patient.patientStatus}
                      </span>
                    </td>
                    <td className="p-2 text-sm text-gray-700 dark:text-gray-200">{patient.billingProvider}</td>
                    <td className="p-2 text-sm text-gray-700 dark:text-gray-200">{patient.practice}</td>
                    <td className="p-2 text-sm text-gray-700 dark:text-gray-200">{formatDate(patient.startOfEpisode)}</td>
                    <td className="p-2 text-sm text-gray-700 dark:text-gray-200">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            patient.episodeDaysRemaining > 30
                              ? "bg-green-500"
                              : patient.episodeDaysRemaining > 15
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${Math.min((patient.episodeDaysRemaining / 60) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs mt-1 block">{patient.episodeDaysRemaining} days</span>
                    </td>
                    <td className="p-2 text-sm text-gray-700 dark:text-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              patient.ordersTotal > 0 && patient.ordersSigned / patient.ordersTotal === 1
                                ? "bg-green-500"
                                : patient.ordersTotal > 0 && patient.ordersSigned / patient.ordersTotal > 0.5
                                ? "bg-blue-500"
                                : "bg-orange-500"
                            }`}
                            style={{
                              width: `${
                                patient.ordersTotal > 0
                                  ? (patient.ordersSigned / patient.ordersTotal) * 100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {patient.ordersSigned}/{patient.ordersTotal}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-32 h-9 text-sm border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1 || isLoading}
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              className="h-9 text-sm px-3 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Prev
            </Button>
            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                className={`h-9 w-9 text-sm border-gray-300 dark:border-gray-600 ${
                  currentPage === page
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } transition-colors`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={currentPage === totalPages || isLoading}
              onClick={() => handlePageChange(currentPage + 1)}
              className="h-9 text-sm px-3 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PatientsPage: React.FC = () => {
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <PatientsPageContent />
      </Suspense>
    </DashboardLayout>
  );
};

export default PatientsPage;