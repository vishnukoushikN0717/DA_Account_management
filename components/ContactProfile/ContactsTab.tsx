"use client";

import { Card } from "@/components/ui/card";
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
  Users,
  UserPlus,
  Mail,
  Phone,
  MoreHorizontal,
  Filter,
  Search,
  Download
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phoneNo: string;
  relatedContacts?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    email: string;
    phoneNo: string;
    avatarUrl?: string;
    relationship: string;
    status: string;
    lastInteraction: string;
  }>;
}

interface ContactsTabProps {
  contact: Contact;
}

export function ContactsTab({ contact }: ContactsTabProps) {
  // Sample data for related contacts
  const sampleRelatedContacts = contact.relatedContacts || [
    {
      id: "1",
      firstName: "Michael",
      lastName: "Johnson",
      jobTitle: "Clinical Director",
      email: "michael.j@example.com",
      phoneNo: "(555) 345-6789",
      avatarUrl: "/avatars/default.png",
      relationship: "Supervisor",
      status: "Active",
      lastInteraction: "2024-03-15"
    },
    {
      id: "2",
      firstName: "Sarah",
      lastName: "Williams",
      jobTitle: "Nurse Practitioner",
      email: "sarah.w@example.com",
      phoneNo: "(555) 456-7890",
      avatarUrl: "/avatars/default.png",
      relationship: "Team Member",
      status: "Active",
      lastInteraction: "2024-03-14"
    },
    {
      id: "3",
      firstName: "David",
      lastName: "Brown",
      jobTitle: "Healthcare Administrator",
      email: "david.b@example.com",
      phoneNo: "(555) 567-8901",
      avatarUrl: "/avatars/default.png",
      relationship: "Colleague",
      status: "Inactive",
      lastInteraction: "2024-03-10"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Related Contacts</h2>
          <p className="text-sm text-gray-500">{sampleRelatedContacts.length} contacts found</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search contacts..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select className="px-3 py-2 border rounded-md text-sm">
              <option value="">All Relationships</option>
              <option value="supervisor">Supervisor</option>
              <option value="team-member">Team Member</option>
              <option value="colleague">Colleague</option>
            </select>
            <select className="px-3 py-2 border rounded-md text-sm">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Contacts Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Relationship</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Interaction</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleRelatedContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10">
                      <Image
                        src={contact.avatarUrl || "/avatars/default.png"}
                        alt={`${contact.firstName} ${contact.lastName}`}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/contacts/${contact.id}`} className="font-medium hover:underline">
                        {`${contact.firstName} ${contact.lastName}`}
                      </Link>
                      <p className="text-sm text-gray-500">{contact.jobTitle}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{contact.relationship}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    contact.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {contact.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(contact.lastInteraction).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`mailto:${contact.email}`}>
                        <Mail className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`tel:${contact.phoneNo}`}>
                        <Phone className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {sampleRelatedContacts.length} of {sampleRelatedContacts.length} contacts
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 