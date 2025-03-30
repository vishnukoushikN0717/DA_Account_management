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
  Mail,
  Phone,
  X,
  MapPin,
  Search,
  ArrowUpIcon,
  ArrowDownIcon,
  UserCircle,
  Building2,
  Unlink,
  Loader2,
  PencilIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Practice, AssociatedEntity } from "@/types/practice";
import { useRouter } from "next/navigation";

interface ContactsTabProps {
  practice: Practice;
}

interface Contact extends AssociatedEntity {
  jobTitle?: string;
  email?: string;
  phoneNo?: string;
  location?: string;
}

export function ContactsTab({ practice }: ContactsTabProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Contact;
    direction: "ascending" | "descending";
  }>({ key: "name", direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isUnlinkDialogOpen, setIsUnlinkDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Filter contacts from associated entities
  const contacts = practice.associatedEntities?.filter(
    (entity) => entity.entityType?.toUpperCase() === "CONTACT"
  ) || [];

  // Filter based on search term
  const filteredContacts = contacts.filter((contact) =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort contacts
  const sortedContacts = [...filteredContacts].sort((a, b) => {
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

  // Paginate contacts
  const totalPages = Math.ceil(sortedContacts.length / itemsPerPage);
  const paginatedContacts = sortedContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const requestSort = (key: keyof Contact) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleUnlink = async () => {
    if (!selectedContact) return;

    try {
      setIsUnlinking(true);
      const response = await fetch(
        `/api/EntityUnlinking/${practice.entityType}/${practice.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            {
              entityType: "CONTACT",
              id: selectedContact.id,
            },
          ]),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unlink contact");
      }

      toast.success(`Contact ${selectedContact.name} has been successfully unlinked`);
      
      // Remove the unlinked contact from the list
      const updatedContacts = contacts.filter(
        (contact) => contact.id !== selectedContact.id
      );
      practice.associatedEntities = practice.associatedEntities?.filter(
        (entity) => entity.id !== selectedContact.id
      );

    } catch (error) {
      console.error("Error unlinking contact:", error);
      toast.error("Failed to unmap contact");
    } finally {
      setIsUnlinking(false);
      setIsUnlinkDialogOpen(false);
      setSelectedContact(null);
    }
  };

  const handleEdit = (contact: Contact) => {
    router.push(`/contact/edit/${contact.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </Card>

      {/* Contacts Table */}
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
                    Contact Name
                    <span className="flex flex-col">
                      <ArrowUpIcon className={`h-3 w-3 ${
                        sortConfig.key === "name" && sortConfig.direction === "ascending"
                          ? "text-white"
                          : "text-gray-400"
                      }`} />
                      <ArrowDownIcon className={`h-3 w-3 ${
                        sortConfig.key === "name" && sortConfig.direction === "descending"
                          ? "text-white"
                          : "text-gray-400"
                      }`} />
                    </span>
                  </div>
                </TableHead>
                <TableHead className="text-gray w-20">Unmap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedContacts.map((contact, index) => (
                <TableRow key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-6 w-6 text-gray-400" />
                      <span className="font-medium">{contact.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(contact)}
                        className="hover:text-blue-600 hover:bg-blue-100"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedContact(contact);
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
              {paginatedContacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No contacts found
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
            <AlertDialogTitle>Unmap Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unmap {selectedContact?.name} from this practice? 
              This action will remove the association between the contact and the practice.
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
                  Unmapping...
                </>
              ) : (
                "Unmap Contact"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}