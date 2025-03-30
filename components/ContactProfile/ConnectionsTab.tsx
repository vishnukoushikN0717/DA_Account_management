"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Search,
  User,
} from "lucide-react";
import { Contact } from "@/types/contact";

interface ConnectionsTabProps {
  contact: Contact;
}

interface EntityDetail {
  entityName: string;
  entityType: string;
  subType: string;
  location?: string;
  id: string;
}

export function ConnectionsTab({ contact }: ConnectionsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter practices and contacts from associated entities
  const practices = contact.associatedEntities?.filter(
    (entity) => entity.entityType?.toUpperCase() === "PRACTICE"
  ) || [];

  const contacts = contact.associatedEntities?.filter(
    (entity) => entity.entityType?.toUpperCase() === "CONTACT"
  ) || [];

  // Convert to EntityDetail format
  const entityDetails: EntityDetail[] = [
    ...practices.map(practice => ({
      entityName: practice.name,
      entityType: "Practice",
      subType: "Medical Practice",
      id: practice.id
    })),
    ...contacts.map(contact => ({
      entityName: contact.name,
      entityType: "Contact",
      subType: "Contact Person",
      id: contact.id
    }))
  ];

  // Filter based on search term
  const filteredDetails = entityDetails.filter(detail =>
    detail.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.entityType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate
  const totalPages = Math.ceil(filteredDetails.length / itemsPerPage);
  const paginatedDetails = filteredDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Organization Chart */}
      <Card className="p-6">
        <div className="relative bg-white dark:bg-[#0F1729] overflow-hidden">
          <div className="flex flex-col items-center">
            {/* Contact Name */}
            <div className="relative flex flex-col items-center mb-12">
              <div className="px-4 py-1.5 bg-blue-600 rounded-lg z-10">
                <h2 className="text-sm font-semibold text-white whitespace-nowrap">
                  {contact.firstName} {contact.lastName}
                </h2>
              </div>
              <div className="absolute top-full w-[2px] h-6 bg-blue-500" />
            </div>

            {/* Entity Cards */}
            <div className="w-full relative">
              <div className="absolute -top-6 left-[25%] right-[25%] h-[1px] bg-blue-500" />
              <div className="grid grid-cols-2 gap-8 px-[20%]">
                {/* Practices Card */}
                <div className="relative flex flex-col items-center">
                  <div className="absolute -top-6 w-[2px] h-6 bg-blue-500" />
                  <div className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-[#1E2B3E] border-blue-500/30">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        {practices.length}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Practices</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contacts Card */}
                <div className="relative flex flex-col items-center">
                  <div className="absolute -top-6 w-[2px] h-6 bg-blue-500" />
                  <div className="w-full rounded-lg border px-3 py-2 bg-white dark:bg-[#1E2B3E] border-blue-500/30">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                        {contacts.length}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">Contacts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Connected Entities List */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Connected Entities</h3>
            <div className="w-[250px]">
              <Input
                placeholder="Search entities..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            {paginatedDetails.map((detail) => (
              <div
                key={detail.id}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700
                  hover:bg-gray-50 dark:hover:bg-[#1E2B3E]/50 
                  transition-colors duration-200"
              >
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {detail.entityName}
                </h4>
                <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{detail.entityType}</span>
                  <span>•</span>
                  <span>{detail.subType}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-xs rounded border dark:border-gray-700 disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-2 py-1 text-xs rounded border dark:border-gray-700 ${
                    currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : ''
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-xs rounded border dark:border-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {filteredDetails.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No connected entities found
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}