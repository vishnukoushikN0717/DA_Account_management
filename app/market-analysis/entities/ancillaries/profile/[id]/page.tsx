"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ProfileCard } from "@/components/Profile/ProfileCard";
import { InformationTab } from "@/components/Profile/InformationTab";
import { OrganizationChart } from "@/components/Profile/AncilliaryOrganizationChart";
import { ContactsTab } from "@/components/Profile/ContactsTab";
import { PractitionersTab } from "@/components/Profile/PractitionersTab";
import { PracticesTab } from "@/components/Profile/PracticesTab";
import { DashboardTab } from "@/components/Profile/DashboardTab";
import { toast } from "sonner";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Practice, AssociatedEntity } from "@/types/practice";

export default function PracticeProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { isOpen } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);
  const [practice, setPractice] = useState<Practice | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'information' | 'connections' | 'contacts' | 'practitioners' | 'practices'>('dashboard');

  useEffect(() => {
    const fetchPractice = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://dawaventity-g5a6apetdkambpcu.eastus-01.azurewebsites.net/api/Entity/${params.id}?EntityType=ANCILLIARY`, 
          {
            method: "GET",
            headers: {
              accept: "*/*",
            },
          }
        );
    
        if (!response.ok) {
          throw new Error("Failed to fetch practice data");
        }

        const data = await response.json();
        
        // Map the API response to our Practice interface
        const mappedPractice: Practice = {
          id: data.id || params.id,
          entityNpiNumber: data.entityNpiNumber || "N/A",
          name: data.name || "N/A",
          entityType: data.entityType || "N/A",
          entitySubtype: data.entitySubtype || "N/A",
          loggedInUser: data.loggedInUser || null,
          services: data.services || [],
          addressType: data.addressType || "",
          mapLink: data.mapLink || "",
          divisionalGroup: data.divisionalGroup || "",
          division: data.division || "",
          subdivision: data.subdivision || "",
          sector: data.sector || "",
          lifecycleStage: data.lifecycleStage || "N/A",
          county: data.county || "N/A",
          email: data.email || "N/A",
          phoneNo: data.phoneNo || "N/A",
          alternatePhone: data.alternatePhone || "",
          website: data.website || "",
          faxNo: data.faxNo || "",
          linkedInId: data.linkedInId || "",
          facebookId: data.facebookId || "",
          instagramId: data.instagramId || "",
          twitterId: data.twitterId || "",
          streetAddress: data.streetAddress || "N/A",
          city: data.city || "N/A",
          state: data.state || "N/A",
          zipcode: data.zipcode || "N/A",
          noOfPatients: data.noOfPatients || 0,
          noOfActivePatients: data.noOfActivePatients || 0,
          noOfLocations: data.noOfLocations || 0,
          noOfEmployees: data.noOfEmployees || 0,
          yearlyRevenue: data.yearlyRevenue || "N/A",
          medicalSpeciality: data.medicalSpeciality || "N/A",
          clinicalServices: data.clinicalServices || "N/A",
          insuranceAccepted: Array.isArray(data.insuranceAccepted) ? data.insuranceAccepted : [],
          associatedEntities: Array.isArray(data.e_AssociatedEntitys) ? data.e_AssociatedEntitys.map((entity: any) => ({
            id: entity.id,
            entityType: entity.entityType,
            name: entity.name
          })) : [],
          doximityId: "",
          logo: "",
          locationImage: "",
          noOfActivePatientsHHAH: "",
          parentCorporate: "",
          e_AssociatedEntitys: []
        };

        setPractice(mappedPractice);
      } catch (error) {
        console.error("Error fetching practice data:", error);
        toast.error("Failed to load practice data");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPractice();
    }
  }, [params.id]);

  if (isLoading || !practice) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading Ancillary details...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed Header */}
      <div className={cn(
        "fixed top-16 right-8 bg-gray-50 dark:bg-gray-900 z-50 border-b dark:border-gray-800 transition-all duration-300",
        isOpen ? "left-72" : "left-24"
      )}>
        <div className="flex justify-between items-center py-2 px-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 dark:text-gray-100 font-medium">
            Ancillary Profile
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/market-analysis/entities/ancillaries/landing')}
            className="flex items-center gap-2 h-8 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Ancillaries
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-8 pb-6 px-6 flex">
        {/* Fixed Left Sidebar */}
        <div className="fixed w-[350px] top-[8rem] bottom-6">
          <ProfileCard
            practice={practice}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Scrollable Right Content */}
        <div className="ml-[380px] flex-1">
          {activeTab === 'dashboard' ? (
            <DashboardTab practice={practice} />
          ) : activeTab === 'information' ? (
            <InformationTab practice={practice} />
          ) : activeTab === 'connections' ? (
            <OrganizationChart practice={practice} />
          ) : activeTab === 'practitioners' ? (
            <PractitionersTab practice={practice} />
          ) : activeTab === 'practices' ? (
            <PracticesTab practice={practice} />
          ) : (
            <ContactsTab practice={practice} />
          )}
        </div>
      </div>
    </div>
  );
}