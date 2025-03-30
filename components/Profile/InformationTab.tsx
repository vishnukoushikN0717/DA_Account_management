"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
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
  MapPin,
  Mail,
  Phone,
  Users,
  DollarSign,
  Stethoscope,
  Building2,
  Globe,
  Shield,
  FileText,
  Briefcase,
  Activity,
  X,
  Database,
  User,
  Calendar,
  Hash,
  Building,
  Network,
  Unlink,
  Loader2,
} from "lucide-react";
import { Practice } from "@/types/practice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface InformationTabProps {
  practice: Practice;
}

interface EntityToUnmap {
  id: string;
  name: string;
  type: string;
}

export function InformationTab({ practice }: InformationTabProps) {
  const [isUnlinkDialogOpen, setIsUnlinkDialogOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<EntityToUnmap | null>(null);
  const [isUnlinking, setIsUnlinking] = useState(false);

  // Filter EHR, Insurance, and Corporate entities
  const ehrSystems = practice.associatedEntities?.filter(entity => 
    entity.entityType === "EHR"
  ) || [];

  const insuranceProviders = practice.associatedEntities?.filter(entity => 
    entity.entityType === "INSURANCE"
  ) || [];

  const corporateEntities = practice.associatedEntities?.filter(entity => 
    entity.entityType?.toUpperCase() === "CORPORATE"
  ) || [];

  const handleUnmap = async () => {
    if (!selectedEntity) return;

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
              entityType: selectedEntity.type,
              id: selectedEntity.id,
            },
          ]),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unmap entity");
      }

      toast.success(`${selectedEntity.type} ${selectedEntity.name} has been successfully unmapped`);
      
      // Update the local state to reflect the change
      practice.associatedEntities = practice.associatedEntities?.filter(
        (entity) => entity.id !== selectedEntity.id
      );

    } catch (error) {
      console.error("Error unmapping entity:", error);
      toast.error("Failed to unmap entity");
    } finally {
      setIsUnlinking(false);
      setIsUnlinkDialogOpen(false);
      setSelectedEntity(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Basic Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{practice.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Entity Type</p>
            <p className="font-medium">{practice.entityType}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Entity Subtype</p>
            <p className="font-medium">{practice.entitySubtype}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">NPI Number</p>
            <p className="font-medium">{practice.entityNpiNumber}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Lifecycle Stage</p>
            <p className="font-medium">{practice.lifecycleStage}</p>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Phone className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Contact Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <p className="text-sm text-gray-500">Email</p>
            </div>
            <p className="font-medium">{practice.email}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <p className="text-sm text-gray-500">Phone</p>
            </div>
            <p className="font-medium">{practice.phoneNo}</p>
          </div>
          {practice.alternatePhone && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-500">Alternate Phone</p>
              </div>
              <p className="font-medium">{practice.alternatePhone}</p>
            </div>
          )}
          {practice.faxNo && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-500">Fax</p>
              </div>
              <p className="font-medium">{practice.faxNo}</p>
            </div>
          )}
          {practice.website && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-500">Website</p>
              </div>
              <a href={practice.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {practice.website}
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Location Information */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Location Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Address Type</p>
            <p className="font-medium">{practice.addressType}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Street Address</p>
            <p className="font-medium">{practice.streetAddress}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">City</p>
            <p className="font-medium">{practice.city}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">State</p>
            <p className="font-medium">{practice.state}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">County</p>
            <p className="font-medium">{practice.county}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">ZIP Code</p>
            <p className="font-medium">{practice.zipcode}</p>
          </div>
          {practice.mapLink && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Map Link</p>
              <a href={practice.mapLink} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                View on Map
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Organization Structure */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Organization Structure</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Divisional Group</p>
            <p className="font-medium">{practice.divisionalGroup || "N/A"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Division</p>
            <p className="font-medium">{practice.division || "N/A"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Subdivision</p>
            <p className="font-medium">{practice.subdivision || "N/A"}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Sector</p>
            <p className="font-medium">{practice.sector || "N/A"}</p>
          </div>
        </div>

        {/* Mapped Entities */}
        {(corporateEntities.length > 0 || ehrSystems.length > 0 || insuranceProviders.length > 0) && (
          <div className="space-y-6 mt-6 pt-6 border-t dark:border-gray-800">
            <h4 className="text-sm font-medium">Mapped Entities</h4>
            
            {/* Corporate Entities */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-gray-500">Corporate</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {corporateEntities.length > 0 ? (
                  corporateEntities.map((corporate) => (
                    <div
                      key={corporate.id}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium group"
                    >
                      {corporate.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-transparent"
                        onClick={() => {
                          setSelectedEntity({
                            id: corporate.id,
                            name: corporate.name,
                            type: "CORPORATE"
                          });
                          setIsUnlinkDialogOpen(true);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">N/A</span>
                )}
              </div>
            </div>

            {/* EHR Systems */}
            {ehrSystems.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-gray-500">EHR Used</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ehrSystems.map((ehr) => (
                    <div
                      key={ehr.id}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium group"
                    >
                      {ehr.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-transparent"
                        onClick={() => {
                          setSelectedEntity({
                            id: ehr.id,
                            name: ehr.name,
                            type: "EHR"
                          });
                          setIsUnlinkDialogOpen(true);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insurance Providers */}
            {(insuranceProviders.length > 0 || practice.insuranceAccepted?.length > 0) && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-gray-500">Insurance Accepted</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {insuranceProviders.map((insurance) => (
                    <div
                      key={insurance.id}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium group"
                    >
                      {insurance.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-transparent"
                        onClick={() => {
                          setSelectedEntity({
                            id: insurance.id,
                            name: insurance.name,
                            type: "INSURANCE"
                          });
                          setIsUnlinkDialogOpen(true);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {practice.insuranceAccepted?.map((insurance, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {insurance}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Practice Metrics */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Metrics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">Total Patients</p>
            </div>
            <p className="text-xl font-semibold">{practice.noOfPatients.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">Active Patients</p>
            </div>
            <p className="text-xl font-semibold">{practice.noOfActivePatients.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">HHAH Active Patients</p>
            </div>
            <p className="text-xl font-semibold">{practice.noOfActivePatientsHHAH || "0"}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">Locations</p>
            </div>
            <p className="text-xl font-semibold">{practice.noOfLocations}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">Employees</p>
            </div>
            <p className="text-xl font-semibold">{practice.noOfEmployees}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">Physicians</p>
            </div>
            <p className="text-xl font-semibold">{practice.noOfPhysicians || "0"}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg col-span-3">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">Yearly Revenue</p>
            </div>
            <p className="text-xl font-semibold">{practice.yearlyRevenue || "N/A"}</p>
          </div>
        </div>
      </Card>

      {/* Services & Specialties */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Services & Specialties</h3>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Medical Specialty</p>
              <p className="font-medium">{practice.medicalSpeciality}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Clinical Services</p>
              <p className="font-medium">{practice.clinicalServices}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Additional Services</p>
              <p className="font-medium">{practice.services}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Social Media */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Network className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Social Media</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {practice.linkedInId && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">LinkedIn</p>
              <a href={practice.linkedInId} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {practice.linkedInId}
              </a>
            </div>
          )}
          {practice.facebookId && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Facebook</p>
              <a href={practice.facebookId} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {practice.facebookId}
              </a>
            </div>
          )}
          {practice.instagramId && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Instagram</p>
              <a href={practice.instagramId} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {practice.instagramId}
              </a>
            </div>
          )}
          {practice.twitterId && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Twitter</p>
              <a href={practice.twitterId} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {practice.twitterId}
              </a>
            </div>
          )}
          {practice.doximityId && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Doximity</p>
              <p className="font-medium">{practice.doximityId}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Unmap Confirmation Dialog */}
      <AlertDialog open={isUnlinkDialogOpen} onOpenChange={setIsUnlinkDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unmap Entity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unmap {selectedEntity?.name} from this practice? 
              This action will remove the association between the {selectedEntity?.type.toLowerCase()} and the practice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnlinking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnmap}
              disabled={isUnlinking}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isUnlinking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unmapping...
                </>
              ) : (
                "Unmap Entity"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
//   "use client";

// import { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   MapPin,
//   Mail,
//   Phone,
//   Users,
//   DollarSign,
//   Stethoscope,
//   Building2,
//   Globe,
//   Shield,
//   FileText,
//   Briefcase,
//   Activity,
//   Database,
//   User,
//   Calendar,
//   Hash,
//   Building,
//   Network,
//   PencilIcon,
//   Save,
//   X,
// } from "lucide-react";
// import { Practice } from "@/types/practice";
// import { toast } from "sonner";

// interface InformationTabProps {
//   practice: Practice;
// }

// interface EditableSections {
//   basic: boolean;
//   contact: boolean;
//   location: boolean;
//   organization: boolean;
//   metrics: boolean;
//   services: boolean;
//   social: boolean;
// }

// export function InformationTab({ practice: initialPractice }: InformationTabProps) {
//   const [practice, setPractice] = useState<Practice>(initialPractice);
//   const [editSections, setEditSections] = useState<EditableSections>({
//     basic: false,
//     contact: false,
//     location: false,
//     organization: false,
//     metrics: false,
//     services: false,
//     social: false,
//   });

//   // Filter EHR and Insurance entities
//   const ehrSystems = practice.associatedEntities?.filter(entity => 
//     entity.entityType === "EHR"
//   ) || [];

//   const insuranceProviders = practice.associatedEntities?.filter(entity => 
//     entity.entityType === "INSURANCE"
//   ) || [];

//   const toggleEdit = (section: keyof EditableSections) => {
//     setEditSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const handleInputChange = (field: keyof Practice, value: any) => {
//     setPractice(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSave = async (section: keyof EditableSections) => {
//     try {
//       // Clean and validate the data before sending
//       const practiceData = {
//         id: practice.id,
//         name: practice.name,
//         loggedInUser: practice.loggedInUser || "",
//         entityType: practice.entityType,
//         entitySubtype: practice.entitySubtype,
//         lifecycleStage: practice.lifecycleStage,
//         entityNpiNumber: practice.entityNpiNumber,
//         clinicalServices: practice.clinicalServices,
//         services: practice.services || "",
//         addressType: practice.addressType || "",
//         state: practice.state,
//         city: practice.city,
//         county: practice.county,
//         zipcode: Number(practice.zipcode) || 0,
//         streetAddress: practice.streetAddress,
//         mapLink: practice.mapLink || "",
//         divisionalGroup: practice.divisionalGroup || "",
//         division: practice.division || "",
//         subdivision: practice.subdivision || "",
//         sector: practice.sector || "",
//         email: practice.email,
//         phoneNo: practice.phoneNo,
//         alternatePhone: practice.alternatePhone || "",
//         website: practice.website || "",
//         faxNo: practice.faxNo || "",
//         linkedInId: practice.linkedInId || "",
//         facebookId: practice.facebookId || "",
//         instagramId: practice.instagramId || "",
//         twitterId: practice.twitterId || "",
//         doximityId: practice.doximityId || "",
//         medicalSpeciality: practice.medicalSpeciality,
//         insuranceAccepted: Array.isArray(practice.insuranceAccepted) ? practice.insuranceAccepted : [],
//         logo: practice.logo || "",
//         locationImage: practice.locationImage || "",
//         noOfPatients: Number(practice.noOfPatients) || 0,
//         noOfActivePatients: Number(practice.noOfActivePatients) || 0,
//         noOfActivePatientsHHAH: practice.noOfActivePatientsHHAH || "",
//         noOfLocations: Number(practice.noOfLocations) || 0,
//         noOfEmployees: Number(practice.noOfEmployees) || 0,
//         yearlyRevenue: practice.yearlyRevenue || "",
//         parentCorporate: practice.parentCorporate || "",
//         e_AssociatedEntitys: Array.isArray(practice.e_AssociatedEntitys) ? practice.e_AssociatedEntitys : []
//       };
  
//       // Make the API call to the correct endpoint
//       const response = await fetch(
//         `https://dawaventity-g5a6apetdkambpcu.eastus-01.azurewebsites.net/api/Entity/${practice.id}?EntityType=PRACTICE`,
//         {
//           method: 'PUT',
//           headers: {
//             'Accept': '*/*',
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(practiceData)
//         }
//       );
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('API Error:', errorData);
//         throw new Error(errorData.message || 'Failed to update practice');
//       }
  
//       const updatedData = await response.json();
//       setPractice(updatedData);
//       toggleEdit(section);
//       toast.success('Changes saved successfully');
//     } catch (error) {
//       console.error('Error saving changes:', error);
//       toast.error('Failed to save changes');
//     }
//   };

//   const EditableField = ({ 
//     label, 
//     value, 
//     field, 
//     isEditing 
//   }: { 
//     label: string;
//     value: string | number;
//     field: keyof Practice;
//     isEditing: boolean;
//   }) => {
//     return (
//       <div className="space-y-2">
//         <p className="text-sm text-gray-500">{label}</p>
//         {isEditing ? (
//           <Input
//             value={value}
//             onChange={(e) => handleInputChange(field, e.target.value)}
//             className="max-w-md"
//           />
//         ) : (
//           <p className="font-medium">{value || "N/A"}</p>
//         )}
//       </div>
//     );
//   };

//   const SectionHeader = ({ 
//     title, 
//     icon: Icon, 
//     section,
//     showEdit = true,
//   }: { 
//     title: string;
//     icon: any;
//     section: keyof EditableSections;
//     showEdit?: boolean;
//   }) => {
//     const isEditing = editSections[section];

//     return (
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-2">
//           <Icon className="h-5 w-5 text-blue-600" />
//           <h3 className="text-lg font-semibold">{title}</h3>
//         </div>
//         {showEdit && (
//           <div className="flex gap-2">
//             {isEditing ? (
//               <>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => toggleEdit(section)}
//                   className="text-red-600 hover:text-red-700"
//                 >
//                   <X className="h-4 w-4 mr-1" />
//                   Cancel
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={() => handleSave(section)}
//                   className="bg-blue-600 hover:bg-blue-700 text-white"
//                 >
//                   <Save className="h-4 w-4 mr-1" />
//                   Save
//                 </Button>
//               </>
//             ) : (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => toggleEdit(section)}
//                 className="text-blue-600 hover:text-blue-700"
//               >
//                 <PencilIcon className="h-4 w-4 mr-1" />
//                 Edit
//               </Button>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Basic Information */}
//       <Card className="p-6">
//         <SectionHeader title="Basic Information" icon={FileText} section="basic" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <EditableField
//             label="Practice Name"
//             value={practice.name}
//             field="name"
//             isEditing={editSections.basic}
//           />
//           <EditableField
//             label="Entity Type"
//             value={practice.entityType}
//             field="entityType"
//             isEditing={editSections.basic}
//           />
//           <EditableField
//             label="Entity Subtype"
//             value={practice.entitySubtype}
//             field="entitySubtype"
//             isEditing={editSections.basic}
//           />
//           <EditableField
//             label="NPI Number"
//             value={practice.entityNpiNumber}
//             field="entityNpiNumber"
//             isEditing={editSections.basic}
//           />
//           <EditableField
//             label="Lifecycle Stage"
//             value={practice.lifecycleStage}
//             field="lifecycleStage"
//             isEditing={editSections.basic}
//           />
//           {/* <EditableField
//             label="Logged In User"
//             value={practice.loggedInUser}
//             field="loggedInUser"
//             isEditing={editSections.basic}
//           /> */}
//         </div>
//       </Card>

//       {/* Contact Information */}
//       <Card className="p-6">
//         <SectionHeader title="Contact Information" icon={Phone} section="contact" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <EditableField
//             label="Email"
//             value={practice.email}
//             field="email"
//             isEditing={editSections.contact}
//           />
//           <EditableField
//             label="Phone"
//             value={practice.phoneNo}
//             field="phoneNo"
//             isEditing={editSections.contact}
//           />
//           <EditableField
//             label="Alternate Phone"
//             value={practice.alternatePhone}
//             field="alternatePhone"
//             isEditing={editSections.contact}
//           />
//           <EditableField
//             label="Fax"
//             value={practice.faxNo}
//             field="faxNo"
//             isEditing={editSections.contact}
//           />
//           <EditableField
//             label="Website"
//             value={practice.website}
//             field="website"
//             isEditing={editSections.contact}
//           />
//         </div>
//       </Card>

//       {/* Location Information */}
//       <Card className="p-6">
//         <SectionHeader title="Location Information" icon={MapPin} section="location" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <EditableField
//             label="Address Type"
//             value={practice.addressType}
//             field="addressType"
//             isEditing={editSections.location}
//           />
//           <EditableField
//             label="Street Address"
//             value={practice.streetAddress}
//             field="streetAddress"
//             isEditing={editSections.location}
//           />
//           <EditableField
//             label="City"
//             value={practice.city}
//             field="city"
//             isEditing={editSections.location}
//           />
//           <EditableField
//             label="State"
//             value={practice.state}
//             field="state"
//             isEditing={editSections.location}
//           />
//           <EditableField
//             label="County"
//             value={practice.county}
//             field="county"
//             isEditing={editSections.location}
//           />
//           <EditableField
//             label="ZIP Code"
//             value={practice.zipcode}
//             field="zipcode"
//             isEditing={editSections.location}
//           />
//           <EditableField
//             label="Map Link"
//             value={practice.mapLink}
//             field="mapLink"
//             isEditing={editSections.location}
//           />
//         </div>
//       </Card>

//       {/* Organization Structure */}
//       <Card className="p-6">
//         <SectionHeader title="Organization Structure" icon={Building2} section="organization" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <EditableField
//             label="Divisional Group"
//             value={practice.divisionalGroup}
//             field="divisionalGroup"
//             isEditing={editSections.organization}
//           />
//           <EditableField
//             label="Division"
//             value={practice.division}
//             field="division"
//             isEditing={editSections.organization}
//           />
//           <EditableField
//             label="Subdivision"
//             value={practice.subdivision}
//             field="subdivision"
//             isEditing={editSections.organization}
//           />
//           <EditableField
//             label="Sector"
//             value={practice.sector}
//             field="sector"
//             isEditing={editSections.organization}
//           />
//           <EditableField
//             label="Parent Corporate"
//             value={practice.parentCorporate}
//             field="parentCorporate"
//             isEditing={editSections.organization}
//           />
//         </div>
//       </Card>

//       {/* Practice Metrics */}
//       <Card className="p-6">
//         <SectionHeader title="Practice Metrics" icon={Activity} section="metrics" />
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//             <div className="flex items-center gap-2 mb-2">
//               <Users className="h-4 w-4 text-blue-600" />
//               <p className="text-sm text-gray-500">Total Patients</p>
//             </div>
//             {editSections.metrics ? (
//               <Input
//                 type="number"
//                 value={practice.noOfPatients}
//                 onChange={(e) => handleInputChange('noOfPatients', parseInt(e.target.value))}
//                 className="mt-2"
//               />
//             ) : (
//               <p className="text-xl font-semibold">{practice.noOfPatients.toLocaleString()}</p>
//             )}
//           </div>
//           <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//             <div className="flex items-center gap-2 mb-2">
//               <Users className="h-4 w-4 text-blue-600" />
//               <p className="text-sm text-gray-500">Active Patients</p>
//             </div>
//             {editSections.metrics ? (
//               <Input
//                 type="number"
//                 value={practice.noOfActivePatients}
//                 onChange={(e) => handleInputChange('noOfActivePatients', parseInt(e.target.value))}
//                 className="mt-2"
//               />
//             ) : (
//               <p className="text-xl font-semibold">{practice.noOfActivePatients.toLocaleString()}</p>
//             )}
//           </div>
//           <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//             <div className="flex items-center gap-2 mb-2">
//               <Users className="h-4 w-4 text-blue-600" />
//               <p className="text-sm text-gray-500">HHAH Active Patients</p>
//             </div>
//             {editSections.metrics ? (
//               <Input
//                 value={practice.noOfActivePatientsHHAH}
//                 onChange={(e) => handleInputChange('noOfActivePatientsHHAH', e.target.value)}
//                 className="mt-2"
//               />
//             ) : (
//               <p className="text-xl font-semibold">{practice.noOfActivePatientsHHAH || "0"}</p>
//             )}
//           </div>
//           <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//             <div className="flex items-center gap-2 mb-2">
//               <Building2 className="h-4 w-4 text-blue-600" />
//               <p className="text-sm text-gray-500">Locations</p>
//             </div>
//             {editSections.metrics ? (
//               <Input
//                 type="number"
//                 value={practice.noOfLocations}
//                 onChange={(e) => handleInputChange('noOfLocations', parseInt(e.target.value))}
//                 className="mt-2"
//               />
//             ) : (
//               <p className="text-xl font-semibold">{practice.noOfLocations}</p>
//             )}
//           </div>
//           <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//             <div className="flex items-center gap-2 mb-2">
//               <Users className="h-4 w-4 text-blue-600" />
//               <p className="text-sm text-gray-500">Employees</p>
//             </div>
//             {editSections.metrics ? (
//               <Input
//                 type="number"
//                 value={practice.noOfEmployees}
//                 onChange={(e) => handleInputChange('noOfEmployees', parseInt(e.target.value))}
//                 className="mt-2"
//               />
//             ) : (
//               <p className="text-xl font-semibold">{practice.noOfEmployees}</p>
//             )}
//           </div>
//           <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
//             <div className="flex items-center gap-2 mb-2">
//               <Stethoscope className="h-4 w-4 text-blue-600" />
//               <p className="text-sm text-gray-500">Physicians</p>
//             </div>
//             {editSections.metrics ? (
//               <Input
//                 type="number"
//                 value={practice.noOfPhysicians}
//                 onChange={(e) => handleInputChange('noOfPhysicians', parseInt(e.target.value))}
//                 className="mt-2"
//               />
//             ) : (
//               <p className="text-xl font-semibold">{practice.noOfPhysicians || "0"}</p>
//             )}
//           </div>
//           <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg col-span-3">
//             <div className="flex items-center gap-2 mb-2">
//               <DollarSign className="h-4 w-4 text-blue-600" />
//               <p className="text-sm text-gray-500">Yearly Revenue</p>
//             </div>
//             {editSections.metrics ? (
//               <Input
//                 value={practice.yearlyRevenue}
//                 onChange={(e) => handleInputChange('yearlyRevenue', e.target.value)}
//                 className="mt-2"
//               />
//             ) : (
//               <p className="text-xl font-semibold">{practice.yearlyRevenue || "N/A"}</p>
//             )}
//           </div>
//         </div>
//       </Card>

//       {/* Services & Specialties */}
//       <Card className="p-6">
//         <SectionHeader title="Services & Specialties" icon={Briefcase} section="services" />
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <EditableField
//               label="Medical Specialty"
//               value={practice.medicalSpeciality}
//               field="medicalSpeciality"
//               isEditing={editSections.services}
//             />
//             <EditableField
//               label="Clinical Services"
//               value={practice.clinicalServices}
//               field="clinicalServices"
//               isEditing={editSections.services}
//             />
//             <EditableField
//               label="Additional Services"
//               value={practice.services}
//               field="services"
//               isEditing={editSections.services}
//             />
//             {/* <EditableField
//               label="EHR Used"
//               value={practice.ehrUsed}
//               field="ehrUsed"
//               isEditing={editSections.services}
//             /> */}
//           </div>

//           {/* EHR Systems */}
//           {ehrSystems.length > 0 && (
//             <div className="space-y-3 pt-4 border-t dark:border-gray-800">
//               <div className="flex items-center gap-2">
//                 <Database className="h-4 w-4 text-blue-600" />
//                 <p className="text-sm text-gray-500">EHR Systems</p>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {ehrSystems.map((ehr) => (
//                   <span
//                     key={ehr.id}
//                     className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
//                   >
//                     {ehr.name}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Insurance */}
//           {(insuranceProviders.length > 0 || practice.insuranceAccepted?.length > 0) && (
//             <div className="space-y-3 pt-4 border-t dark:border-gray-800">
//               <div className="flex items-center gap-2">
//                 <Shield className="h-4 w-4 text-blue-600" />
//                 <p className="text-sm text-gray-500">Insurance Providers</p>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {insuranceProviders.map((insurance) => (
//                   <span
//                     key={insurance.id}
//                     className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
//                   >
//                     {insurance.name}
//                   </span>
//                 ))}
//                 {practice.insuranceAccepted?.map((insurance, index) => (
//                   <span
//                     key={index}
//                     className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
//                   >
//                     {insurance}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Social Media */}
//       <Card className="p-6">
//         <SectionHeader title="Social Media" icon={Network} section="social" />
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <EditableField
//             label="LinkedIn"
//             value={practice.linkedInId}
//             field="linkedInId"
//             isEditing={editSections.social}
//           />
//           <EditableField
//             label="Facebook"
//             value={practice.facebookId}
//             field="facebookId"
//             isEditing={editSections.social}
//           />
//           <EditableField
//             label="Instagram"
//             value={practice.instagramId}
//             field="instagramId"
//             isEditing={editSections.social}
//           />
//           <EditableField
//             label="Twitter"
//             value={practice.twitterId}
//             field="twitterId"
//             isEditing={editSections.social}
//           />
//           <EditableField
//             label="Doximity"
//             value={practice.doximityId}
//             field="doximityId"
//             isEditing={editSections.social}
//           />
//         </div>
//       </Card>
//     </div>
//   );
// }