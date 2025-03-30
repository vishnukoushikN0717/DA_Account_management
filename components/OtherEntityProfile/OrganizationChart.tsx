"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Database,
  User,
  Shield,
  Stethoscope,
  Search,
  Loader2,
} from "lucide-react";

interface EntityDetail {
  entityName: string;
  entityType: string;
  subType: string;
  location?: string;
  id: string;
}

interface AssociatedEntity {
  id: string;
  entityType: string;
  name: string;
}

interface Practitioner {
  id: string;
  firstName: string;
  associatedEntities?: AssociatedEntity[];
}

interface OrganizationChartProps {
  practitioner: Practitioner;
}

export function OrganizationChart({ practitioner }: OrganizationChartProps) {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [entityDetails, setEntityDetails] = useState<EntityDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Entity type counts from associated entities
  const [entityCounts, setEntityCounts] = useState({
    practitioners: 0,
    contacts: 0,
    corporate: 0,
    ehr: 0,
    insurance: 0
  });

  useEffect(() => {
    if (practitioner.associatedEntities) {
      const counts = {
        practitioners: practitioner.associatedEntities.filter(e => e.entityType?.toUpperCase() === "PRACTITIONER").length,
        contacts: practitioner.associatedEntities.filter(e => e.entityType?.toUpperCase() === "CONTACT").length,
        corporate: practitioner.associatedEntities.filter(e => e.entityType?.toUpperCase() === "CORPORATE").length,
        ehr: practitioner.associatedEntities.filter(e => e.entityType?.toUpperCase() === "EHR").length,
        insurance: practitioner.associatedEntities.filter(e => e.entityType?.toUpperCase() === "INSURANCE").length
      };
      setEntityCounts(counts);
    }
  }, [practitioner.associatedEntities]);

  const entityData = [
    {
      id: "corporate",
      name: "Corporate",
      icon: <Building2 className="h-3.5 w-3.5" />,
      count: entityCounts.corporate
    },
    {
      id: "ehr",
      name: "EHR",
      icon: <Database className="h-3.5 w-3.5" />,
      count: entityCounts.ehr
    },
    {
      id: "practitioners",
      name: "Practitioners",
      icon: <Stethoscope className="h-3.5 w-3.5" />,
      count: entityCounts.practitioners
    },
    {
      id: "contacts",
      name: "Contacts",
      icon: <User className="h-3.5 w-3.5" />,
      count: entityCounts.contacts
    },
    {
      id: "insurance",
      name: "Insurance",
      icon: <Shield className="h-3.5 w-3.5" />,
      count: entityCounts.insurance
    }
  ];

  const handleEntityClick = (entityId: string) => {
    setIsLoading(true);
    setSelectedEntity(entityId);
    
    if (practitioner.associatedEntities) {
      let filteredEntities: AssociatedEntity[] = [];
      
      switch (entityId) {
        case "practitioners":
          filteredEntities = practitioner.associatedEntities.filter(e => e.entityType?.toUpperCase() === "PRACTITIONER");
          break;
        case "contacts":
          filteredEntities = practitioner.associatedEntities.filter(e => e.entityType?.toUpperCase() === "CONTACT");
          break;
        case "corporate":
          filteredEntities = practitioner.associatedEntities.filter(e => e.entityType?.toUpperCase() === "CORPORATE");
          break;
        case "ehr":
          filteredEntities = practitioner.associatedEntities.filter(e => e.entityType?.toUpperCase() === "EHR");
          break;
        case "insurance":
          filteredEntities = practitioner.associatedEntities.filter(e => e.entityType?.toUpperCase() === "INSURANCE");
          break;
      }

      const mappedDetails: EntityDetail[] = filteredEntities.map(entity => ({
        entityName: entity.name,
        entityType: entity.entityType,
        subType: getSubTypeByEntityType(entityId),
        id: entity.id
      }));

      setEntityDetails(mappedDetails);
    }
    
    setIsLoading(false);
  };

  const getSubTypeByEntityType = (entityType: string): string => {
    switch (entityType) {
      case "practitioners":
        return "Healthcare Practitioner";
      case "contacts":
        return "Contact Person";
      case "corporate":
        return "Corporate Entity";
      case "ehr":
        return "Electronic Health Record";
      case "insurance":
        return "Insurance Provider";
      default:
        return "Unknown";
    }
  };

  const filteredDetails = entityDetails.filter(detail =>
    detail.entityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDetails.length / itemsPerPage);
  const paginatedDetails = filteredDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {/* Organization Chart */}
      <Card className="p-6">
        <div className="relative bg-white dark:bg-[#0F1729] overflow-hidden">
          <div className="flex flex-col items-center">
            {/* Practitioner Name */}
            <div className="relative flex flex-col items-center mb-12">
              <div className="px-4 py-1.5 bg-blue-600 rounded-lg z-10">
                <h2 className="text-sm font-semibold text-white whitespace-nowrap">
                  {"Organisation Chart"}
                </h2>
              </div>
              <div className="absolute top-full w-[2px] h-6 bg-blue-500" />
            </div>

            {/* Entity Cards */}
            <div className="w-full relative">
              <div className="absolute -top-6 left-[13%] right-[13%] h-[1px] bg-blue-500" />
              <div className="grid grid-cols-5 gap-3 px-[5%]">
                {entityData.map((entity) => (
                  <div key={entity.id} className="relative flex flex-col items-center">
                    <div className="absolute -top-6 w-[2px] h-6 bg-blue-500" />
                    <button
                      onClick={() => handleEntityClick(entity.id)}
                      className={`
                        w-full rounded-lg border px-2 py-1.5
                        ${selectedEntity === entity.id
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-white dark:bg-[#1E2B3E] border-blue-500/30'
                        }
                        transition-all duration-200
                        cursor-pointer
                        hover:border-blue-400
                      `}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-sm font-bold ${
                          selectedEntity === entity.id
                            ? 'text-white'
                            : 'text-gray-800 dark:text-gray-200'
                        }`}>
                          {entity.count}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {entity.icon}
                          <span className="text-xs font-medium whitespace-nowrap">
                            {entity.name}
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Entity Details */}
      {selectedEntity && (
        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {selectedEntity === "practitioners" ? "Associated Practitioners" :
                 selectedEntity === "contacts" ? "Associated Contacts" :
                 selectedEntity === "corporate" ? "Corporate Entities" :
                 selectedEntity === "ehr" ? "EHR Systems" :
                 "Insurance Providers"}
              </h3>
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

            {isLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
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
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="h-7 text-xs px-2"
                    >
                      Prev
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant="outline"
                        className={`h-7 text-xs px-2 min-w-[24px] ${currentPage === i + 1 ? 'bg-blue-600 text-white' : ''}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="h-7 text-xs px-2"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}