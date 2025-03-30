"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ProfileCard } from "@/components/OtherEntityProfile/ProfileCard";
import { InformationTab } from "@/components/OtherEntityProfile/InformationTab";
import { OrganizationChart } from "@/components/OtherEntityProfile/OrganizationChart";
import { ContactsTab } from "@/components/OtherEntityProfile/ContactsTab";
import { PractitionersTab } from "@/components/OtherEntityProfile/PractitionersTab";
import { PracticesTab } from "@/components/OtherEntityProfile/PracticesTab";
import { DashboardTab } from "@/components/OtherEntityProfile/DashboardTab";
import { toast } from "sonner";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Practitioner, AssociatedEntity } from "@/types/practitioner";
export default function PractitionerProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { isOpen } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);
  const [practitioner, setPractitioner] = useState<Practitioner | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'information' | 'connections' | 'contacts' | 'practices'>('dashboard');

  useEffect(() => {
    const fetchPractitioner = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/Practitioner/${params.id}`, {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch practitioner data");
        }

        const data = await response.json();
        setPractitioner(data);
      } catch (error) {
        console.error("Error fetching practitioner data:", error);
        toast.error("Failed to load practitioner data");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPractitioner();
    }
  }, [params.id]);

  if (isLoading || !practitioner) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading practitioner details...</span>
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
              Practitioner Profile
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/market-analysis/entities/practitioner/landing')}
            className="flex items-center gap-2 h-8 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Practitioners
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-8 pb-6 px-6 flex">
        {/* Fixed Left Sidebar */}
        <div className="fixed w-[350px] top-[8rem] bottom-6">
          <ProfileCard
            practitioner={practitioner}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Scrollable Right Content */}
        <div className="ml-[380px] flex-1">
          {activeTab === 'dashboard' ? (
            <DashboardTab practitioner={practitioner} />
          ) : activeTab === 'information' ? (
            <InformationTab practitioner={practitioner} />
          ) : activeTab === 'connections' ? (
            <OrganizationChart practitioner={practitioner} />
          ) : activeTab === 'practices' ? (
            <PracticesTab practitioner={practitioner} />
          ) : (
            <ContactsTab practitioner={practitioner} />
          )}
        </div>
      </div>
    </div>
  );
}