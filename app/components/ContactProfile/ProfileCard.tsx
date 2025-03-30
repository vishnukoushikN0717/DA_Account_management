"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Info,
  Link as LinkIcon,
  Building2,
  BarChart2,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Edit,
  UserSquare2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phoneNo: string;
  avatarUrl?: string;
  linkedinId?: string;
  twitterId?: string;
  facebookId?: string;
  instagramId?: string;
  contactType: string;
  personaType: string;
  contactLifecycleStage: string;
  createdAt: string;
  updatedAt: string;
}

type TabType = 'dashboard' | 'information' | 'connections' | 'practices' | 'practitioners';

interface ProfileCardProps {
  contact: Contact;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function ProfileCard({ contact, activeTab, onTabChange }: ProfileCardProps) {
  return (
    <Card className="w-full h-full overflow-auto">
      {/* Header Section */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between mb-4">
          <div className="relative h-20 w-20">
            <Image
              src={contact.avatarUrl || "/avatars/default.png"}
              alt={`${contact.firstName} ${contact.lastName}`}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/market-analysis/entities/contacts/edit/${contact.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
        <h2 className="text-xl font-semibold">{`${contact.firstName} ${contact.lastName}`}</h2>
        <p className="text-sm text-gray-500">{contact.jobTitle}</p>
      </div>

      {/* Quick Info Section */}
      <div className="p-6 border-b space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-gray-500" />
          <Link href={`mailto:${contact.email}`} className="text-sm hover:underline">
            {contact.email}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-gray-500" />
          <Link href={`tel:${contact.phoneNo}`} className="text-sm hover:underline">
            {contact.phoneNo}
          </Link>
        </div>
      </div>

      {/* Entity Info Section */}
      <div className="p-6 border-b">
        <h3 className="text-sm font-medium mb-4">Entity Information</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500">Contact Type</p>
            <p className="text-sm">{contact.contactType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Persona Type</p>
            <p className="text-sm">{contact.personaType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Lifecycle Stage</p>
            <p className="text-sm">{contact.contactLifecycleStage}</p>
          </div>
        </div>
      </div>

      {/* System Info Section */}
      <div className="p-6 border-b">
        <h3 className="text-sm font-medium mb-4">System Information</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500">Created</p>
            <p className="text-sm">{new Date(contact.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Last Updated</p>
            <p className="text-sm">{new Date(contact.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="p-6">
        <div className="space-y-2">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onTabChange('dashboard')}
          >
            <BarChart2 className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'information' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onTabChange('information')}
          >
            <Info className="h-4 w-4 mr-2" />
            Information
          </Button>
          <Button
            variant={activeTab === 'connections' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onTabChange('connections')}
          >
            <Users className="h-4 w-4 mr-2" />
            Connections
          </Button>
          <Button
            variant={activeTab === 'practices' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onTabChange('practices')}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Practices
          </Button>
          <Button
            variant={activeTab === 'practitioners' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onTabChange('practitioners')}
          >
            <UserSquare2 className="h-4 w-4 mr-2" />
            Practitioners
          </Button>
        </div>
      </div>
    </Card>
  );
} 