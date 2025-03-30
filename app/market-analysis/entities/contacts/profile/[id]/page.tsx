"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ProfileCard } from "@/components/ContactProfile/ProfileCard";
import { InformationTab } from "@/components/ContactProfile/InformationTab";
import { ConnectionsTab } from "@/components/ContactProfile/ConnectionsTab";
import { PracticesTab } from "@/components/ContactProfile/PracticesTab";
import { PractitionersTab } from "@/components/ContactProfile/PractitionersTab";
import { DashboardTab } from "@/components/ContactProfile/DashboardTab";
import { toast } from "sonner";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Contact } from "@/types/contact";

type TabType = 'dashboard' | 'information' | 'connections' | 'practices' | 'practitioners';

export default function ContactProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { isOpen } = useSidebar();
  const [isLoading, setIsLoading] = useState(true);
  const [contact, setContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/Contact/${params.id}`, {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch contact data");
        }

        const data = await response.json();
        setContact(data);
      } catch (error) {
        console.error("Error fetching contact data:", error);
        toast.error("Failed to load contact data");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchContact();
    }
  }, [params.id]);

  if (isLoading || !contact) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading contact details...</span>
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
              Contact Profile
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/market-analysis/entities/contacts/landing')}
            className="flex items-center gap-2 h-8 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contacts
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-8 pb-6 px-6 flex">
        {/* Fixed Left Sidebar */}
        <div className="fixed w-[350px] top-[8rem] bottom-6">
          <ProfileCard
            contact={contact}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Scrollable Right Content */}
        <div className="ml-[380px] flex-1">
          {activeTab === 'dashboard' ? (
            <DashboardTab contact={contact} />
          ) : activeTab === 'information' ? (
            <InformationTab contact={contact} />
          ) : activeTab === 'connections' ? (
            <ConnectionsTab contact={contact} />
          ) : activeTab === 'practices' ? (
            <PracticesTab contact={contact} />
          ) : activeTab === 'practitioners' ? (
            <PractitionersTab contact={contact} />
          ) : null}
        </div>
      </div>
    </div>
  );
}