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
  Network,
  PencilIcon,
  User,
  Briefcase,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Contact } from "@/types/contact";

interface ProfileCardProps {
  contact: Contact;
  activeTab: 'dashboard' | 'information' | 'connections' | 'practices' | 'practitioners';
  onTabChange: (tab: 'dashboard' | 'information' | 'connections' | 'practices' | 'practitioners') => void;
}

export function ProfileCard({ contact, activeTab, onTabChange }: ProfileCardProps) {
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
                  {contact.firstName} {contact.lastName}
                </h2>
                <button 
                  onClick={() => router.push(`/contact/edit/${contact.id}`)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{contact.jobTitle}</p>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Mail className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="text-xs truncate">{contact.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Phone className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="text-xs">{contact.phoneNo}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Briefcase className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="text-xs">{contact.jobTitle}</span>
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
          {contact.linkedInID && (
            <a href={contact.linkedInID} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4 text-gray-400 hover:text-[#0A66C2] transition-colors cursor-pointer" />
            </a>
          )}
          {contact.facebookID && (
            <a href={contact.facebookID} target="_blank" rel="noopener noreferrer">
              <Facebook className="h-4 w-4 text-gray-400 hover:text-[#1877F2] transition-colors cursor-pointer" />
            </a>
          )}
          {contact.twitterID && (
            <a href={contact.twitterID} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-4 w-4 text-gray-400 hover:text-[#1DA1F2] transition-colors cursor-pointer" />
            </a>
          )}
          {contact.instagramID && (
            <a href={contact.instagramID} target="_blank" rel="noopener noreferrer">
              <Instagram className="h-4 w-4 text-gray-400 hover:text-[#E4405F] transition-colors cursor-pointer" />
            </a>
          )}
          {contact.website && (
            <a href={contact.website} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" />
            </a>
          )}
        </div>

        {/* Entity Info */}
        {/* <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Persona Type</span>
            <span className="font-medium text-gray-900 dark:text-white">{contact.personaType}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Lifecycle Stage</span>
            <span className="font-medium text-gray-900 dark:text-white">{contact.contactLifecycleStage}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">Contact Owner</span>
            <span className="font-medium text-gray-900 dark:text-white">{contact.contactOwner}</span>
          </div>
        </div> */}

        {/* System Info */}
        {/* {(contact.createdAt || contact.updatedAt) && (
          <div className="space-y-2 pt-2 border-t border-gray-300 dark:border-gray-700">
            {contact.createdAt && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created: {new Date(contact.createdAt).toLocaleDateString()}</span>
              </div>
            )}
            {contact.updatedAt && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>Updated: {new Date(contact.updatedAt).toLocaleDateString()}</span>
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
            variant={activeTab === 'practitioners' ? 'default' : 'outline'}
            onClick={() => onTabChange('practitioners')}
            className={`h-8 text-sm ${
              activeTab === 'practitioners' 
                ? 'bg-gray-300 dark:bg-gray-600 text-black hover:bg-gray-300 dark:hover:bg-gray-300' 
                : 'text-black-300 dark:text-black-200 hover:bg-gray-300 dark:hover:bg-gray-300'
            }`}
          >
            Practitioners
          </Button>
          
          {contact.personaType?.toUpperCase() === "PRACTICE" && (
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