"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Globe,
  Activity,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Stethoscope,
  Network,
  PencilIcon,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Practitioner } from "@/types/practitioner";

interface ProfileCardProps {
  practitioner: Practitioner;
  activeTab: 'dashboard' | 'information' | 'connections' | 'contacts' | 'practices';
  onTabChange: (tab: 'dashboard' | 'information' | 'connections' | 'contacts' | 'practices') => void;
}

export function ProfileCard({ practitioner, activeTab, onTabChange }: ProfileCardProps) {
  const router = useRouter();

  return (
    <Card className="border-gray-300 dark:border-gray-700">
      <div className="p-4 space-y-4">
        {/* Header Section with Avatar */}
        <div className="text-center pb-3 border-b border-gray-300 dark:border-gray-700 relative">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900">
                <User className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {practitioner.firstName} {practitioner.lastName}
                </h2>
                <button 
                  onClick={() => router.push(`/market-analysis/entities/practitioner/edit/${practitioner.id}`)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{practitioner.jobTitle}</p>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Mail className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="text-xs truncate">{practitioner.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Phone className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="text-xs">{practitioner.phoneNo}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Stethoscope className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="text-xs">NPI: {practitioner.individualNpi}</span>
          </div>
        </div>

        {/* View Organization Chart Button */}
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
          onClick={() => onTabChange('connections')}
        >
          <Network className="h-4 w-4" />
          View Organization Chart
        </Button>

        {/* Social Links */}
        <div className="flex justify-center gap-3 py-2 border-t border-b border-gray-300 dark:border-gray-700">
          {practitioner.facebookID && (
            <a href={practitioner.facebookID} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4 text-gray-400 hover:text-[#1877F2] transition-colors cursor-pointer" />
            </a>
          )}
          {practitioner.twitterID && (
            <a href={practitioner.twitterID} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-4 w-4 text-gray-400 hover:text-[#1DA1F2] transition-colors cursor-pointer" />
            </a>
          )}
          {practitioner.instagramID && (
            <a href={practitioner.instagramID} target="_blank" rel="noopener noreferrer">
              <Instagram className="h-4 w-4 text-gray-400 hover:text-[#E4405F] transition-colors cursor-pointer" />
            </a>
          )}
          {practitioner.linkedInID && (
            <a href={practitioner.linkedInID} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4 text-gray-400 hover:text-[#0A66C2] transition-colors cursor-pointer" />
            </a>
          )}
          {practitioner.website && (
            <a href={practitioner.website} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" />
            </a>
          )}
        </div>

        {/* Entity Info */}
        {/* <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Practitioner Type</span>
            <span className="font-medium text-gray-900 dark:text-white">{practitioner.practitionerType}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Persona Type</span>
            <span className="font-medium text-gray-900 dark:text-white">{practitioner.personaType}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Lifecycle Stage</span>
            <span className="font-medium text-gray-900 dark:text-white">{practitioner.practitionerLifecycleStage}</span>
          </div>
        </div> */}

        {/* System Info */}
        {/* {(practitioner.createdAt || practitioner.updatedAt) && (
          <div className="space-y-2 pt-2 border-t border-gray-300 dark:border-gray-700">
            {practitioner.createdAt && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created: {new Date(practitioner.createdAt).toLocaleDateString()}</span>
              </div>
            )}
            {practitioner.updatedAt && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>Updated: {new Date(practitioner.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )} */}

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 gap-2 pt-2">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'outline'}
            onClick={() => onTabChange('dashboard')}
            className={`h-8 text-sm ${
              activeTab === 'dashboard' 
                ? 'bg-gray-300 dark:bg-gray-600 text-black hover:bg-gray-300 dark:hover:bg-gray-300' 
                : 'text-black-300 dark:text-black-200 hover:bg-gray-300 dark:hover:bg-gray-300'
            }`}
          >
            Dashboard
          </Button>
          
          <Button
            variant={activeTab === 'information' ? 'default' : 'outline'}
            onClick={() => onTabChange('information')}
            className={`h-8 text-sm ${
              activeTab === 'information' 
                ? 'bg-gray-300 dark:bg-gray-600 text-black hover:bg-gray-300 dark:hover:bg-gray-300' 
                : 'text-black-300 dark:text-black-200 hover:bg-gray-300 dark:hover:bg-gray-300'
            }`}
          >
            Information
          </Button>
          
          <Button
            variant={activeTab === 'practices' ? 'default' : 'outline'}
            onClick={() => onTabChange('practices')}
            className={`h-8 text-sm ${
              activeTab === 'practices' 
                ? 'bg-gray-300 dark:bg-gray-600 text-black hover:bg-gray-300 dark:hover:bg-gray-300' 
                : 'text-black-300 dark:text-black-200 hover:bg-gray-300 dark:hover:bg-gray-300'
            }`}
          >
            Practices
          </Button>
          
          <Button
            variant={activeTab === 'contacts' ? 'default' : 'outline'}
            onClick={() => onTabChange('contacts')}
            className={`h-8 text-sm ${
              activeTab === 'contacts' 
                ? 'bg-gray-300 dark:bg-gray-600 text-black hover:bg-gray-300 dark:hover:bg-gray-300' 
                : 'text-black-300 dark:text-black-200 hover:bg-gray-300 dark:hover:bg-gray-300'
            }`}
          >
            Contacts
          </Button>
          
          {practitioner.personaType?.toUpperCase() === "PRACTICE" && (
            <Button
              variant={activeTab === "connections" ? "default" : "outline"}
              onClick={() => onTabChange("connections")}
              className={`h-8 text-sm ${
                activeTab === "connections"
                  ? "bg-gray-300 dark:bg-gray-600 text-white hover:bg-gray-300 dark:hover:bg-gray-300"
                  : "text-black-300 dark:text-white-200 hover:bg-gray-300 dark:hover:bg-gray-300"
              }`}
            >
              Connections
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}