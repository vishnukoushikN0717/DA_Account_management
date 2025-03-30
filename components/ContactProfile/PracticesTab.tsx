"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  ArrowUpIcon,
  ArrowDownIcon,
  Building2,
  Unlink,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Contact } from "@/types/contact";

interface PracticesTabProps {
  contact: Contact;
}

interface Practice {
  id: string;
  name: string;
  entityType: string;
}

export function PracticesTab({ contact }: PracticesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Practice;
    direction: "ascending" | "descending";
  }>({ key: "name", direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isUnlinkDialogOpen, setIsUnlinkDialogOpen] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
  const [isUnlinking, setIsUnlinking] = useState(false);

  // Filter practices from associated entities
  const practices = contact.associatedEntities?.filter(
    (entity) => entity.entityType?.toUpperCase() === "PRACTICE"
  ) || [];

  // Filter based on search term
  const filteredPractices = practices.filter((practice) =>
    practice.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort practices
  const sortedPractices = [...filteredPractices].sort((a, b) => {
    if (sortConfig.key === "name") {
      const aValue = a.name || "";
      const bValue = b.name || "";
      if (sortConfig.direction === "ascending") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }
    return 0;
  });

  // Paginate practices
  const totalPages = Math.ceil(sortedPractices.length / itemsPerPage);
  const paginatedPractices = sortedPractices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof Practice) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleUnlink = async () => {
    if (!selectedPractice) return;

    try {
      setIsUnlinking(true);
      const response = await fetch(
        `/api/EntityUnlinking/CONTACT/${contact.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            {
              entityType: "PRACTICE",
              id: selectedPractice.id,
            },
          ]),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unlink practice");
      }

      toast.success(`Practice ${selectedPractice.name} has been successfully unlinked`);
      
      // Update the local state
      contact.associatedEntities = contact.associatedEntities?.filter(
        (entity) => entity.id !== selectedPractice.id
      );

    } catch (error) {
      console.error("Error unlinking practice:", error);
      toast.error("Failed to unlink practice");
    } finally {
      setIsUnlinking(false);
      setIsUnlinkDialogOpen(false);
      setSelectedPractice(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search practices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      {/* Practices Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-200 dark:bg-gray-800">
                <TableHead 
                  className="text-black dark:text-white cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center gap-2">
                    Practice Name
                    <span className="flex flex-col">
                      <ArrowUpIcon className={`h-3 w-3 ${
                        sortConfig.key === "name" && sortConfig.direction === "ascending"
                          ? "text-black dark:text-white"
                          : "text-gray-400"
                      }`} />
                      <ArrowDownIcon className={`h-3 w-3 ${
                        sortConfig.key === "name" && sortConfig.direction === "descending"
                          ? "text-black dark:text-white"
                          : "text-gray-400"
                      }`} />
                    </span>
                  </div>
                </TableHead>
                <TableHead className="text-gray w-20">Unmap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPractices.map((practice, index) => (
                <TableRow key={practice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-6 w-6 text-gray-400" />
                      <span className="font-medium">{practice.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedPractice(practice);
                          setIsUnlinkDialogOpen(true);
                        }}
                        className="hover:text-red-600 hover:bg-red-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedPractices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No practices found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "bg-blue-600 text-white" : ""}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Unlink Confirmation Dialog */}
      <AlertDialog open={isUnlinkDialogOpen} onOpenChange={setIsUnlinkDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink Practice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unmap {selectedPractice?.name} from this contact? 
              This action will remove the association between the practice and the contact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnlinking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnlink}
              disabled={isUnlinking}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isUnlinking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unlinking...
                </>
              ) : (
                "Unlink Practice"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}