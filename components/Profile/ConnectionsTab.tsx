"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Search,
  User,
  Database,
  Shield,
  Stethoscope,
  Loader2
} from "lucide-react";

interface AssociatedEntity {
  id: string;
  entityType: string;
  name: string;
}

interface Practice {
  id: string;
  name: string;
  associatedEntities?: AssociatedEntity[];
}

interface EntityDetail {
  id: string;
  entityName: string;
  entityType: string;
  subType: string;
  location?: string;
}

interface ConnectionsTabProps {
  practice: Practice;
}

export function ConnectionsTab({ practice }: ConnectionsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  // Entity type counts from associated entities
  const [entityCounts, setEntityCounts] = useState({
    corporate: 0,
    ehr: 0,
    practitioners: 0,
    contacts: 0,
    insurance: 0
  });

  // Update entity counts when practice data changes
  useEffect(() => {
    if (practice.associatedEntities) {
      const counts = {
        corporate: practice.associatedEntities.filter(e => e.entityType?.toUpperCase() === "CORPORATE").length,
        ehr: practice.associatedEntities.filter(e => e.entityType?.toUpperCase() === "EHR").length,
        practitioners: practice.associatedEntities.filter(e => e.entityType?.toUpperCase() === "PRACTITIONER").length,
        contacts: practice.associatedEntities.filter(e => e.entityType?.toUpperCase() === "CONTACT").length,
        insurance: practice.associatedEntities.filter(e => e.entityType?.toUpperCase() === "INSURANCE").length
      };
      setEntityCounts(counts);
    }
  }, [practice.associatedEntities]);

  // Convert associated entities to EntityDetail format
  const entityDetails: EntityDetail[] = practice.associatedEntities?.map(entity => ({
    id: entity.id,
    entityName: entity.name,
    entityType: entity.entityType,
    subType: entity.entityType === "CORPORATE" ? "Corporate Entity" :
             entity.entityType === "EHR" ? "Electronic Health Record" :
             entity.entityType === "PRACTITIONER" ? "Healthcare Provider" :
             entity.entityType === "CONTACT" ? "Contact Person" :
             entity.entityType === "INSURANCE" ? "Insurance Provider" : "Other"
  })) || [];

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
      {/* Connections Tab Header */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Connections</h2>
        <p className="text-gray-600 dark:text-gray-400">
          This is the Connections tab. It displays all entities connected to {practice.name}.
        </p>
      </Card>

     
    </div>
  );
} 