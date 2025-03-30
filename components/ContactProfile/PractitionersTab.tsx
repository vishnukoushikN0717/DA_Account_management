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
  UserCircle,
  Unlink,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Contact } from "@/types/contact";

interface PractitionersTabProps {
  contact: Contact;
}

interface Practitioner {
  id: string;
  name: string;
  entityType: string;
}

export function PractitionersTab({ contact }: PractitionersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Practitioner;
    direction: "ascending" | "descending";
  }>({ key: "name", direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isUnlinkDialogOpen, setIsUnlinkDialogOpen] = useState(false);
  const [selectedPractitioner, setSelectedPractitioner] = useState<Practitioner | null>(null);
  const [isUnlinking, setIsUnlinking] = useState(false);

  // Filter practitioners from associated entities
  const practitioners = contact.associatedEntities?.filter(
    (entity) => entity.entityType?.toUpperCase() === "PRACTITIONER"
  ) || [];

  // Filter based on search term
  const filteredPractitioners = practitioners.filter((practitioner) =>
    practitioner.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort practitioners
  const sortedPractitioners = [...filteredPractitioners].sort((a, b) => {
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

  // Paginate practitioners
  const totalPages = Math.ceil(sortedPractitioners.length / itemsPerPage);
  const paginatedPractitioners = sortedPractitioners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof Practitioner) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleUnlink = async () => {
    if (!selectedPractitioner) return;

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
              entityType: "PRACTITIONER",
              id: selectedPractitioner.id,
            },
          ]),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unlink practitioner");
      }

      toast.success(`Practitioner ${selectedPractitioner.name} has been successfully unlinked`);
      
      // Update the local state
      contact.associatedEntities = contact.associatedEntities?.filter(
        (entity) => entity.id !== selectedPractitioner.id
      );

    } catch (error) {
      console.error("Error unlinking practitioner:", error);
      toast.error("Failed to unlink practitioner");
    } finally {
      setIsUnlinking(false);
      setIsUnlinkDialogOpen(false);
      setSelectedPractitioner(null);
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
              placeholder="Search practitioners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      {/* Practitioners Table */}
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
                    Practitioner Name
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
              {paginatedPractitioners.map((practitioner, index) => (
                <TableRow key={practitioner.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-6 w-6 text-gray-400" />
                      <span className="font-medium">{practitioner.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedPractitioner(practitioner);
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
              {paginatedPractitioners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No practitioners found
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
            <AlertDialogTitle>Unlink Practitioner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unmap {selectedPractitioner?.name} from this contact? 
              This action will remove the association between the practitioner and the contact.
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
                "Unlink Practitioner"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}