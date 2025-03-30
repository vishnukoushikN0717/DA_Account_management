"use client";

import React, { useState, useEffect } from "react";
import { ArrowUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (item: T, index: number) => React.ReactNode; // Updated to include index
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  fetchData: () => Promise<T[]>;
  initialSortKey?: string;
  initialSortDirection?: "ascending" | "descending";
  itemsPerPageOptions?: number[];
  theme?: "dark" | "light";
}

const CustomTable = <T,>({
  columns,
  fetchData,
  initialSortKey = "",
  initialSortDirection = "ascending",
  itemsPerPageOptions = [10, 20, 50, 100],
  theme = "dark",
}: CustomTableProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [sortedData, setSortedData] = useState<T[]>([]);
  const [sortConfig, setSortConfig] = useState({
    key: initialSortKey,
    direction: initialSortDirection,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Determine theme-specific styles
  const styles = {
    dark: {
      table: "bg-gray-900",
      header: "bg-gray-800 text-white border-gray-700",
      headerHover: "hover:text-blue-400",
      row: "hover:bg-gray-800 border-gray-700",
      cell: "text-gray-200",
      pagination: "bg-gray-900 border-gray-700",
      button: "border-gray-600 text-white hover:bg-gray-800",
      activeButton: "bg-blue-600 text-white hover:bg-blue-700",
      selectTrigger: "border-gray-600 bg-gray-800 text-white",
      selectContent: "bg-gray-800 text-white border-gray-600",
      skeleton: "bg-gray-800",
      noData: "text-gray-400",
    },
    light: {
      table: "bg-white",
      header: "bg-gray-100 text-gray-700 border-gray-200",
      headerHover: "hover:text-blue-600",
      row: "hover:bg-gray-50 border-gray-200",
      cell: "text-gray-700",
      pagination: "bg-white border-gray-200",
      button: "border-gray-300 text-gray-700 hover:bg-gray-100",
      activeButton: "bg-blue-600 text-white hover:bg-blue-700",
      selectTrigger: "border-gray-300 bg-white text-gray-700",
      selectContent: "bg-white text-gray-700 border-gray-300",
      skeleton: "bg-gray-200",
      noData: "text-gray-500",
    },
  };

  const currentStyle = styles[theme];

  // Fetch data when component mounts or fetchData changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchData();
        setData(result);
        setSortedData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
        setSortedData([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchData]);

  // Sort data when sortConfig changes
  useEffect(() => {
    let sorted = [...data];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const key = sortConfig.key as keyof T;
        const aValue = a[key] ?? "";
        const bValue = b[key] ?? "";
        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    setSortedData(sorted);
    setCurrentPage(1);
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: string) => (
    <ArrowUpDownIcon
      className={`h-4 w-4 ml-1 inline transition-transform duration-200 ${sortConfig.key === key
        ? sortConfig.direction === "ascending"
          ? "text-blue-600 rotate-0"
          : "text-blue-600 rotate-180"
        : "text-gray-400 " + currentStyle.headerHover
        }`}
    />
  );

  const paginatedData = sortedData.slice(
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={`flex-1 ${currentStyle.table} rounded-lg shadow-md border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
      {/* Table with increased height */}
      <div
        className="w-full min-w-[1000px] overflow-y-auto"
        style={{ maxHeight: "calc(98vh - 350px)" }} // Increased table height
      >
        <table className="w-full border-collapse">
          <thead className={`${currentStyle.header} sticky top-0 z-10 border-b`}>
            <tr className="h-12">
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={`p-2 pl-4 text-left text-sm font-semibold whitespace-nowrap cursor-pointer ${currentStyle.headerHover} transition-colors`}
                  style={{ width: column.width || "auto" }}
                  onClick={() => requestSort(column.key as string)}
                >
                  {column.header} {getSortIcon(column.key as string)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {columns.map((column) => (
                    <td key={column.key as string} className="p-3">
                      <div className={`h-4 ${currentStyle.skeleton} rounded w-32`}></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className={`p-2 text-center ${currentStyle.noData} text-sm`}
                >
                  {data.length === 0 ? "No data found" : "No matching data"}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                // Calculate the actual index based on the current page
                const actualIndex = (currentPage - 1) * itemsPerPage + index + 1;

                return (
                  <tr
                    key={index}
                    className={`${currentStyle.row} transition-colors cursor-pointer ${index !== 0 ? 'border-t' : ''}`}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key as string}
                        className={`p-3 text-sm ${currentStyle.cell}`} // Increased padding from p-2 to p-3
                      >
                        {column.render
                          ? column.render(item, actualIndex)
                          : column.key === 'srNo'
                            ? actualIndex
                            : (item[column.key as keyof T] as React.ReactNode) || "N/A"}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination with increased spacing */}
      <div className={`mt-6 p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}> {/* Increased mt-6 to mt-8 and p-2 to p-4 */}
        <div className={`flex items-center justify-between ${currentStyle.pagination} p-2 rounded-lg`}>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className={`w-32 h-9 text-sm ${currentStyle.selectTrigger}`}>
              <SelectValue placeholder="Per page" />
            </SelectTrigger>
            <SelectContent className={currentStyle.selectContent}>
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1 || isLoading}
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              className={`h-9 text-sm px-3 ${currentStyle.button} transition-colors`}
            >
              Prev
            </Button>
            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                className={`h-9 w-9 text-sm ${currentPage === page
                  ? currentStyle.activeButton
                  : currentStyle.button
                  } transition-colors`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={currentPage === totalPages || isLoading}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`h-9 text-sm px-3 ${currentStyle.button} transition-colors`}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;