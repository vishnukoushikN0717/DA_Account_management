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
  Building2,
  Activity,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Stethoscope,
  Network,
  LayoutDashboard,
  PencilIcon,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileCardProps {
  practice: {
    id: string;
    name: string;
    county: string;
    entityType: string;
    entitySubtype: string;
    lifecycleStage: string;
    entityNpiNumber: string;
    email: string;
    state: string;
    city: string;
    phoneNo: string;
    createdAt?: string;
    updatedAt?: string;
    facebookId?: string;
    twitterId?: string;
    instagramId?: string;
    linkedInId?: string;
    website?: string;
    logo?: string;
  };
  activeTab:
    | "dashboard"
    | "information"
    | "connections"
    | "contacts"
    | "practitioners"
    | "practices";
  onTabChange: (
    tab:
      | "dashboard"
      | "information"
      | "connections"
      | "contacts"
      | "practitioners"
      | "practices"
  ) => void;
}
const getEditRoute = (id: string, entityType: string) => {
  const type = entityType.toUpperCase();
  switch (type) {
    case "PRACTICE":
      return `/market-analysis/entities/practice/edit/${id}`;
    case "CORPORATE":
      return `/market-analysis/entities/corporate/edit/${id}`;
    case "PRACTITIONER":
      return `/market-analysis/entities/practitioner/edit/${id}`;
    case "INSURANCE":
      return `/market-analysis/entities/insurance/edit/${id}`;
    case "EHR":
      return `/market-analysis/entities/ehr/edit/${id}`;
    case "ANCILLIARY":
      return `/market-analysis/entities/ancilliary/edit/${id}`;
    default:
      return `/market-analysis/entities/practice/edit/${id}`;
  }
};

export function ProfileCard({
  practice,
  activeTab,
  onTabChange,
}: ProfileCardProps) {
  const router = useRouter();
  const isPractitioner = practice.entityType.toUpperCase() === "PRACTITIONER";

  return (
    <Card className="border-gray-300 dark:border-gray-700">
      <div className="p-3 space-y-3">
        {" "}
        {/* Reduced padding and spacing */}
        {/* Header Section with Avatar */}
        <div className="text-center pb-2 border-b border-gray-300 dark:border-gray-700 relative">
          <div className="flex flex-col items-center gap-2">
            {" "}
            {/* Reduced gap */}
            <Avatar className="h-16 w-16">
              {" "}
              {/* Smaller avatar */}
              <AvatarImage
                src={practice.logo}
                alt={practice.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-900">
                <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  {" "}
                  {/* Smaller text */}
                  {practice.name}
                </h2>
                <button
                  onClick={() =>
                    router.push(getEditRoute(practice.id, practice.entityType))
                  }
                  className="text-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <PencilIcon className="h-3.5 w-3.5" /> {/* Smaller icon */}
                </button>
              </div>
              <p className="text-ml text-gray-600 dark:text-gray-400">
                {practice.city}, {practice.state}
              </p>
            </div>
          </div>
        </div>
        {/* Quick Info */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Mail className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="text-xs truncate">{practice.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Phone className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="text-xs">{practice.phoneNo}</span>
          </div>
          {/* <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Stethoscope className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            <span className="text-xs">{practice.entityNpiNumber}</span>
          </div> */}
        </div>
        {/* View Organization Chart Button */}
        <Button
          variant="outline"
          className="w-full h-9 flex items-center justify-center gap-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
          onClick={() => onTabChange("connections")}
        >
          <Network className="h-4 w-4" />
          View Organization Chart
        </Button>
        {/* Social Links */}
        <div className="flex justify-center gap-3 py-2 border-t border-b border-gray-300 dark:border-gray-700">
          {practice.facebookId && (
            <a
              href={practice.facebookId}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <Facebook className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
            </a>
          )}
          {practice.twitterId && (
            <a
              href={practice.twitterId}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <Twitter className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
            </a>
          )}
          {practice.instagramId && (
            <a
              href={practice.instagramId}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <Instagram className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
            </a>
          )}
          {practice.linkedInId && (
            <a
              href={practice.linkedInId}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <Linkedin className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
            </a>
          )}
          {practice.website && (
            <a
              href={practice.website}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform"
            >
              <Globe className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
            </a>
          )}
        </div>
        {/* Entity Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              Entity Type
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {practice.entityType}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              Lifecycle Stage
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {practice.lifecycleStage}
            </span>
          </div>
        </div>
        {/* System Info */}
        {(practice.createdAt || practice.updatedAt) && (
          <div className="space-y-2 pt-2 border-t border-gray-300 dark:border-gray-700">
            {practice.createdAt && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Created: {new Date(practice.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
            {practice.updatedAt && (
              <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Updated: {new Date(practice.updatedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}
        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 gap-2 pt-2">
          <Button
            variant={activeTab === "dashboard" ? "default" : "outline"}
            onClick={() => onTabChange("dashboard")}
            className={`h-8 text-sm ${
              activeTab === "dashboard"
                ? "bg-gray-300 dark:bg-gray-600 text-black hover:bg-gray-300 dark:hover:bg-gray-300"
                : "text-black-300 dark:text-black-200 hover:bg-gray-300 dark:hover:bg-gray-300"
            }`}
          >
            <div className="h-4 w-4 mr-2" />
            Dashboard
          </Button>

          <Button
            variant={activeTab === "information" ? "default" : "outline"}
            onClick={() => onTabChange("information")}
            className={`h-8 text-sm ${
              activeTab === "information"
                ? "bg-gray-300 dark:bg-gray-600 text-black hover:bg-gray-300 dark:hover:bg-gray-300"
                : "text-black-300 dark:text-black-200 hover:bg-gray-300 dark:hover:bg-gray-300"
            }`}
          >
            Information
          </Button>

          {!isPractitioner &&
            practice.entityType.toUpperCase() !== "ANCILLIARY" &&
            practice.entityType.toUpperCase() !== "EHR" &&
            practice.entityType.toUpperCase() !== "INSURANCE" && (
              <Button
                variant={activeTab === "practitioners" ? "default" : "outline"}
                onClick={() => onTabChange("practitioners")}
                className={`h-8 text-sm ${
                  activeTab === "practitioners"
                    ? "bg-gray-300 dark:bg-gray-600 text-black hover:bg-gray-300 dark:hover:bg-gray-300"
                    : "text-black-300 dark:text-black-200 hover:bg-gray-300 dark:hover:bg-gray-300"
                }`}
              >
                Practitioners
              </Button>
            )}

          <Button
            variant={activeTab === "contacts" ? "default" : "outline"}
            onClick={() => onTabChange("contacts")}
            className={`h-8 text-sm ${
              activeTab === "contacts"
                ? "bg-gray-300 dark:bg-gray-600 text-black hover:bg-gray-300 dark:hover:bg-gray-300"
                : "text-black-300 dark:text-black-200 hover:bg-gray-300 dark:hover:bg-gray-300"
            }`}
          >
            Contacts
          </Button>
          {practice.entityType.toUpperCase() !== "PRACTICE" &&
            practice.entityType.toUpperCase() !== "ANCILLIARY" &&
            practice.entityType.toUpperCase() !== "EHR" &&
            practice.entityType.toUpperCase() !== "INSURANCE" && (
              <Button
                variant={activeTab === "practices" ? "default" : "outline"}
                onClick={() => onTabChange("practices")}
                className={`h-8 text-sm ${
                  activeTab === "practices"
                    ? "bg-gray-300 dark:bg-gray-600 text-black hover:bg-gray-300 dark:hover:bg-gray-300"
                    : "text-black-300 dark:text-black-200 hover:bg-gray-300 dark:hover:bg-gray-300"
                }`}
              >
                Practices
              </Button>
            )}

          {practice.entityType?.toUpperCase() === "PRACTICE" && (
            <Button
              variant={activeTab === "connections" ? "default" : "outline"}
              onClick={() => onTabChange("connections")}
              className={`h-8 text-sm ${
                activeTab === "connections"
                  ? "bg-gray-300 dark:bg-gray-600 text-black hover:bg-gray-300 dark:hover:bg-gray-300"
                  : "text-black-300 dark:text-black-200 hover:bg-gray-300 dark:hover:bg-gray-300"
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
