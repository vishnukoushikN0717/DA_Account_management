"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Stethoscope,
  Truck,
  Monitor,
  User,
  Users,
  Shield,
  ArrowLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Entity {
  id: string;
  name: string;
  location?: string;
  email?: string;
  vendor?: string;
  specialty?: string;
  dob?: string;
  industry?: string;
  type?: string;
  practitionerWavId?: string;
  contactWavId?: string;
  jobTitle?: string;
  corporateWavId?: string;
  practiceWavId?: string;
  EHRWavId?: string;
  INSURANCEWavId?: string;
  ANCILLIARYWavId?: string;
  corporateType?: string;
  practiceVertical?: string;
  EHRType?: string;
  INSURANCEType?: string;
  ANCILLIARYVertical?: string;
}

export default function MappingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const entityId = searchParams.get("id");
  const [entityData, setEntityData] = useState<any>(null);
  const [associatedEntities, setAssociatedEntities] = useState<any[]>([]);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [addSections, setAddSections] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [availableEntitiesByType, setAvailableEntitiesByType] = useState<{
    [key: string]: Entity[];
  }>({});
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({});
  const [currentPages, setCurrentPages] = useState<{ [key: string]: number }>(
    {}
  );
  const [rowsPerPageByType, setRowsPerPageByType] = useState<{
    [key: string]: number;
  }>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [currentEntityType, setCurrentEntityType] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchEntityData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://dawavpersona-hvgye7gjbmf6h6fu.eastus-01.azurewebsites.net/api/Practitioner/${entityId}`,
          {
            method: "GET",
            headers: {
              accept: "*/*",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch entity data");
        const data = await response.json();
        setEntityData(data);
        setAssociatedEntities(data.associatedEntities || []);
      } catch (error) {
        console.error("Error fetching entity data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (entityId) fetchEntityData();
  }, [entityId]);

  const toggleSection = (type: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const toggleAddSection = async (type: string) => {
    setAddSections((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
    if (!addSections[type]) {
      await fetchAvailableEntities(type);
    }
  };

  const entityTypes = [
    // {
    //   type: "corporate",
    //   icon: Building2,
    //   endpoint:
    //     "https://dawaventity-g5a6apetdkambpcu.eastus-01.azurewebsites.net/api/Entity/active?EntityType=CORPORATE",
    // },
    {
      type: "practice",
      icon: Stethoscope,
      endpoint:
        "https://dawaventity-g5a6apetdkambpcu.eastus-01.azurewebsites.net/api/Entity/active?EntityType=PRACTICE",
    },
    // {
    //   type: "ANCILLIARY",
    //   icon: Truck,
    //   endpoint:
    //     "https://dawaventity-g5a6apetdkambpcu.eastus-01.azurewebsites.net/api/Entity/active?EntityType=ANCILLIARY",
    // },
    // {
    //   type: "EHR",
    //   icon: Monitor,
    //   endpoint:
    //     "https://dawaventity-g5a6apetdkambpcu.eastus-01.azurewebsites.net/api/Entity/active?EntityType=EHR",
    // },
    // {
    //   type: "practitioner",
    //   icon: User,
    //   endpoint:
    //     "https://dawavpersona-hvgye7gjbmf6h6fu.eastus-01.azurewebsites.net/api/Practitioner/active",
    // },
    {
      type: "contact",
      icon: Users,
      endpoint:
        "https://dawavpersona-hvgye7gjbmf6h6fu.eastus-01.azurewebsites.net/api/Contact/active",
    },
    // {
    //   type: "INSURANCE",
    //   icon: Shield,
    //   endpoint:
    //     "https://dawaventity-g5a6apetdkambpcu.eastus-01.azurewebsites.net/api/Entity/active?EntityType=INSURANCE",
    // },
  ];

  const getFilteredEntities = (type: string) => {
    return associatedEntities.filter(
      (entity) => entity.entityType.toLowerCase() === type.toLowerCase()
    );
  };

  const fetchAvailableEntities = async (type: string) => {
    setIsLoading(true);
    const entityConfig = entityTypes.find((et) => et.type === type);
    if (!entityConfig) return;

    try {
      const response = await fetch(entityConfig.endpoint, {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch ${type} entities`);
      const data = await response.json();

      const mappedEntities = data
        .map((item: any) => {
          if (type === "practitioner") {
            return {
              id: item.id,
              practitionerWavId: item.practitionerWavId || "N/A",
              name:
                `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
                "N/A",
              jobTitle: item.jobTitle || "N/A",
              email: item.email || "N/A",
            };
          } else if (type === "contact") {
            return {
              id: item.id,
              contactWavId: item.contactWavId || "N/A",
              name:
                `${item.firstName || ""} ${item.lastName || ""}`.trim() ||
                "N/A",
              jobTitle: item.jobTitle || "N/A",
              email: item.email || "N/A",
            };
          } else if (type === "corporate") {
            return {
              id: item.id,
              corporateWavId: item.entityWavId || "N/A",
              name: item.name || "N/A",
              corporateType: item.entitySubtype || "N/A",
              email: item.email || "N/A",
            };
          } else if (type === "practice") {
            return {
              id: item.id,
              practiceWavId: item.entityWavId || "N/A",
              name: item.name || "N/A",
              practiceVertical: item.entitySubtype || "N/A",
              email: item.email || "N/A",
            };
          } else if (type === "EHR") {
            return {
              id: item.id,
              EHRWavId: item.entityWavId || "N/A",
              name: item.name || "N/A",
              EHRType: item.entitySubtype || "N/A",
              email: item.email || "N/A",
            };
          } else if (type === "INSURANCE") {
            return {
              id: item.id,
              INSURANCEWavId: item.entityWavId || "N/A",
              name: item.name || "N/A",
              INSURANCEType: item.entitySubtype || "N/A",
              email: item.email || "N/A",
            };
          } else if (type === "ANCILLIARY") {
            return {
              id: item.id,
              ANCILLIARYWavId: item.entityWavId || "N/A",
              name: item.name || "N/A",
              ANCILLIARYVertical: item.entitySubtype || "N/A",
              email: item.email || "N/A",
            };
          }
          return null;
        })
        .filter(Boolean);

      const filteredEntities = mappedEntities.filter((entity: Entity) => {
        return !associatedEntities.some(
          (assoc) =>
            assoc.id === entity.id &&
            assoc.entityType.toLowerCase() === type.toLowerCase()
        );
      });

      setAvailableEntitiesByType((prev) => ({
        ...prev,
        [type]: filteredEntities,
      }));
      setCurrentPages((prev) => ({ ...prev, [type]: 1 }));
      setSearchTerms((prev) => ({ ...prev, [type]: "" }));
      setRowsPerPageByType((prev) => ({ ...prev, [type]: 5 }));
      setSelectedEntities([]);
    } catch (error) {
      console.error(`Error fetching ${type} entities:`, error);
      setAvailableEntitiesByType((prev) => ({
        ...prev,
        [type]: [],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (id: string, type: string) => {
    const useRadio = ["corporate", "practitioner"].includes(type.toLowerCase());
    setSelectedEntities((prev) =>
      useRadio
        ? [id]
        : prev.includes(id)
        ? prev.filter((eid) => eid !== id)
        : [...prev, id]
    );
  };

  const handleAddEntities = async (type: string) => {
    if (selectedEntities.length === 0) return;

    try {
      setIsLoading(true);
      const useRadio = ["corporate", "practitioner"].includes(
        type.toLowerCase()
      );
      const requestBody = useRadio
        ? [
            {
              entityType: type.toUpperCase(),
              id: selectedEntities[0],
            },
          ]
        : selectedEntities.map((id) => ({
            entityType: type.toUpperCase(),
            id,
          }));

      const entityTypeFromData =
        entityData?.entityType?.toUpperCase() || "PRACTICE";
      const response = await fetch(
        `/api/EntityLinking/PRACTITIONER/${entityId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error("Failed to map entities");
      setCurrentEntityType(type);
      setShowSuccessPopup(true);
    } catch (error) {
      console.error("Error mapping entities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (type: string, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [type]: value }));
    setCurrentPages((prev) => ({ ...prev, [type]: 1 }));
  };

  const handlePageChange = (type: string, page: number) => {
    setCurrentPages((prev) => ({ ...prev, [type]: page }));
  };

  const handleRowsPerPageChange = (type: string, value: string) => {
    const rows = parseInt(value, 10);
    setRowsPerPageByType((prev) => ({ ...prev, [type]: rows }));
    setCurrentPages((prev) => ({ ...prev, [type]: 1 }));
  };

  const getFilteredAndPaginatedEntities = (type: string) => {
    const entities = availableEntitiesByType[type] || [];
    const searchTerm = searchTerms[type] || "";
    const rowsPerPage = rowsPerPageByType[type] || 5;

    const filteredEntities = entities.filter((entity) => {
      const idField =
        type === "practitioner"
          ? entity.practitionerWavId
          : type === "contact"
          ? entity.contactWavId
          : type === "corporate"
          ? entity.corporateWavId
          : type === "practice"
          ? entity.practiceWavId
          : type === "EHR"
          ? entity.EHRWavId
          : type === "INSURANCE"
          ? entity.INSURANCEWavId
          : type === "ANCILLIARY"
          ? entity.ANCILLIARYWavId
          : "";
      return (
        entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idField?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ""
      );
    });

    const currentPage = currentPages[type] || 1;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return {
      paginatedEntities: filteredEntities.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredEntities.length / rowsPerPage),
      totalEntities: filteredEntities.length,
    };
  };

  const renderTableColumns = (type: string) => {
    return (
      <>
        <TableHead className="w-16 py-3 text-gray-700 dark:text-gray-200 font-medium">
          Select
        </TableHead>
        <TableHead className="py-3 text-gray-700 dark:text-gray-200 font-medium">
          {type === "practitioner"
            ? "WAV ID"
            : type === "contact"
            ? "WAV ID"
            : type === "corporate"
            ? "Corporate ID"
            : type === "practice"
            ? "Practice ID"
            : type === "EHR"
            ? "EHR ID"
            : type === "INSURANCE"
            ? "INSURANCE ID"
            : type === "ANCILLIARY"
            ? "ANCILLIARY ID"
            : "ID"}
        </TableHead>
        <TableHead className="py-3 text-gray-700 dark:text-gray-200 font-medium">
          Name
        </TableHead>
        <TableHead className="py-3 text-gray-700 dark:text-gray-200 font-medium">
          {type === "practitioner"
            ? "Job Title"
            : type === "contact"
            ? "Job Title"
            : type === "corporate"
            ? "Corporate Type"
            : type === "practice"
            ? "Practice Vertical"
            : type === "EHR"
            ? "EHR Type"
            : type === "INSURANCE"
            ? "INSURANCE Type"
            : type === "ANCILLIARY"
            ? "ANCILLIARY Vertical"
            : "Type"}
        </TableHead>
        <TableHead className="py-3 text-gray-700 dark:text-gray-200 font-medium">
          Email
        </TableHead>
      </>
    );
  };

  const renderTableRow = (entity: Entity, type: string) => {
    const useRadio = ["corporate", "practitioner"].includes(type.toLowerCase());
    return (
      <>
        <TableCell className="py-4">
          {useRadio ? (
            <input
              type="radio"
              name={`entity-${type}`}
              checked={selectedEntities.includes(entity.id)}
              onChange={() => handleCheckboxChange(entity.id, type)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
          ) : (
            <Checkbox
              checked={selectedEntities.includes(entity.id)}
              onCheckedChange={() => handleCheckboxChange(entity.id, type)}
            />
          )}
        </TableCell>
        <TableCell className="py-4 text-gray-900 dark:text-gray-100">
          {type === "practitioner"
            ? entity.practitionerWavId
            : type === "contact"
            ? entity.contactWavId
            : type === "corporate"
            ? entity.corporateWavId
            : type === "practice"
            ? entity.practiceWavId
            : type === "EHR"
            ? entity.EHRWavId
            : type === "INSURANCE"
            ? entity.INSURANCEWavId
            : type === "ANCILLIARY"
            ? entity.ANCILLIARYWavId
            : "N/A"}
        </TableCell>
        <TableCell className="py-4 text-gray-900 dark:text-gray-100">
          {entity.name}
        </TableCell>
        <TableCell className="py-4 text-gray-900 dark:text-gray-100">
          {type === "practitioner"
            ? entity.jobTitle
            : type === "contact"
            ? entity.jobTitle
            : type === "corporate"
            ? entity.corporateType
            : type === "practice"
            ? entity.practiceVertical
            : type === "EHR"
            ? entity.EHRType
            : type === "INSURANCE"
            ? entity.INSURANCEType
            : type === "ANCILLIARY"
            ? entity.ANCILLIARYVertical
            : "N/A"}
        </TableCell>
        <TableCell className="py-4 text-gray-900 dark:text-gray-100">
          {entity.email}
        </TableCell>
      </>
    );
  };

  const handleBack = () => {
    router.push(`/market-analysis/entities/practitioner/landing`);
  };

  return (
    <div className="space-y-6 pb-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Entity Mapping
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      ) : (
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-md overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
            <CardContent className="p-4">
              {entityData && (
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100">
                    {entityData.firstName} {entityData.lastName}
                  </h2>
                  <Button
                    onClick={handleBack}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm py-1 px-3 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </div>
              )}
              {entityData && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {/* {entityData.entityType || "N/A"} |{" "}
                  {entityData.entitySubtype || "N/A"} */}
                  Practitioner
                </p>
              )}
              {isLoading && (
                <p className="text-sm text-muted-foreground mt-2">Loading...</p>
              )}
            </CardContent>
          </Card>

          <div className="border-b border-gray-200 dark:border-gray-700 my-4"></div>

          <p className="text-base text-gray-700 dark:text-gray-300 mb-6 px-4 sm:px-6 lg:px-8">
            Please select an entity to map
          </p>

          {entityTypes.map(({ type, icon: Icon }) => (
            <Card
              key={type}
              className="shadow-md overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 mb-4"
            >
              <CardHeader
                className="bg-gray-50 dark:bg-gray-800 py-3 cursor-pointer flex items-center justify-between"
                onClick={() => toggleSection(type)}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-lg font-medium text-gray-700 dark:text-gray-200">
                    {/* {type === "EHR" ? "EHR" : type.charAt(0).toUpperCase() + type.slice(1)}{" "} */}
                    {type === "EHR"
                      ? "EHR"
                      : type === "INSURANCE"
                      ? "Insurance"
                      : type === "ANCILLIARY"
                      ? "Ancillary"
                      : type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                    ({getFilteredEntities(type).length})
                  </CardTitle>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-base">
                  {expandedSections[type] ? "-" : "+"}
                </span>
              </CardHeader>

              {expandedSections[type] && (
                <CardContent className="p-4 space-y-4">
                  {getFilteredEntities(type).length > 0 ? (
                    <div className="space-y-2">
                      {getFilteredEntities(type).map((entity) => (
                        <div
                          key={entity.id}
                          className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 text-base text-gray-700 dark:text-gray-300"
                        >
                          {entity.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-base text-gray-500 dark:text-gray-400">
                      No associated entities found.
                    </p>
                  )}

                  <Button
                    onClick={() => toggleAddSection(type)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm py-1 px-3 rounded-md flex items-center gap-2 transition-colors"
                  >
                    Add
                  </Button>

                  {addSections[type] && (
                    <div>
                      {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 dark:border-blue-400"></div>
                        </div>
                      ) : (
                        <div>
                          {availableEntitiesByType[type]?.length > 0 ? (
                            <div className="space-y-4">
                              <Input
                                type="text"
                                placeholder="Search by ID or Name"
                                value={searchTerms[type] || ""}
                                onChange={(e) =>
                                  handleSearch(type, e.target.value)
                                }
                                className="w-full max-w-md"
                              />

                              <div className="relative max-h-96 flex flex-col">
                                <Table className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                  <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-800">
                                    <TableRow className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                                      {renderTableColumns(type)}
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody className="overflow-y-auto">
                                    {getFilteredAndPaginatedEntities(
                                      type
                                    ).paginatedEntities.map((entity) => (
                                      <TableRow
                                        key={entity.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                      >
                                        {renderTableRow(entity, type)}
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>

                                <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-700 dark:text-gray-300">
                                      Rows per page:
                                    </span>
                                    <Select
                                      value={(
                                        rowsPerPageByType[type] || 5
                                      ).toString()}
                                      onValueChange={(value) =>
                                        handleRowsPerPageChange(type, value)
                                      }
                                    >
                                      <SelectTrigger className="w-20">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <Button
                                      onClick={() =>
                                        handlePageChange(
                                          type,
                                          (currentPages[type] || 1) - 1
                                        )
                                      }
                                      disabled={(currentPages[type] || 1) === 1}
                                      className="bg-blue-600 hover:bg-blue-500 text-white text-sm py-1 px-3 rounded-md"
                                    >
                                      Previous
                                    </Button>
                                    <span className="text-gray-700 dark:text-gray-300">
                                      Page {currentPages[type] || 1} of{" "}
                                      {
                                        getFilteredAndPaginatedEntities(type)
                                          .totalPages
                                      }
                                    </span>
                                    <Button
                                      onClick={() =>
                                        handlePageChange(
                                          type,
                                          (currentPages[type] || 1) + 1
                                        )
                                      }
                                      disabled={
                                        (currentPages[type] || 1) ===
                                        getFilteredAndPaginatedEntities(type)
                                          .totalPages
                                      }
                                      className="bg-blue-600 hover:bg-blue-500 text-white text-sm py-1 px-3 rounded-md"
                                    >
                                      Next
                                    </Button>
                                  </div>
                                  <Button
                                    onClick={() => handleAddEntities(type)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white text-sm py-1 px-3 rounded-md"
                                    disabled={selectedEntities.length === 0}
                                  >
                                    Add Selected
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-base text-gray-500 dark:text-gray-400">
                              No entities available to add.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Success
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Entity mapped successfully!
            </p>
            <Button
              onClick={() => {
                setShowSuccessPopup(false);
                window.location.reload();
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm py-2 px-4 rounded-md transition-colors"
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
