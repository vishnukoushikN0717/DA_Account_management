"use client";

import { Card } from "@/components/ui/card";
import {
  MapPin,
  Mail,
  Phone,
  FileText,
  Network,
  User,
  Globe,
  Briefcase,
  Building2,
} from "lucide-react";
import { Contact } from "@/types/contact";

interface InformationTabProps {
  contact: Contact;
}

export function InformationTab({ contact }: InformationTabProps) {
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
            <p className="text-sm text-gray-500">First Name</p>
            <p className="font-medium">{contact.firstName}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Last Name</p>
            <p className="font-medium">{contact.lastName}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Job Title</p>
            <p className="font-medium">{contact.jobTitle}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Persona Type</p>
            <p className="font-medium">{contact.personaType}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Lifecycle Stage</p>
            <p className="font-medium">{contact.contactLifecycleStage}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Contact Owner</p>
            <p className="font-medium">{contact.contactOwner}</p>
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
            <p className="font-medium">{contact.email}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <p className="text-sm text-gray-500">Phone</p>
            </div>
            <p className="font-medium">{contact.phoneNo}</p>
          </div>
          {contact.alternatePhone && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-500">Alternate Phone</p>
              </div>
              <p className="font-medium">{contact.alternatePhone}</p>
            </div>
          )}
          {contact.faxNo && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-500">Fax</p>
              </div>
              <p className="font-medium">{contact.faxNo}</p>
            </div>
          )}
          {contact.website && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-500">Website</p>
              </div>
              <a href={contact.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {contact.website}
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
            <p className="text-sm text-gray-500">Street Address</p>
            <p className="font-medium">{contact.streetAddress}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">City</p>
            <p className="font-medium">{contact.city}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">State</p>
            <p className="font-medium">{contact.state}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">County</p>
            <p className="font-medium">{contact.county}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">ZIP Code</p>
            <p className="font-medium">{contact.zipcode}</p>
          </div>
          {contact.mapLink && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Map Link</p>
              <a href={contact.mapLink} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                View on Map
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Social Media */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Network className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Social Media</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contact.linkedInID && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">LinkedIn</p>
              <a href={contact.linkedInID} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {contact.linkedInID}
              </a>
            </div>
          )}
          {contact.facebookID && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Facebook</p>
              <a href={contact.facebookID} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {contact.facebookID}
              </a>
            </div>
          )}
          {contact.instagramID && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Instagram</p>
              <a href={contact.instagramID} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {contact.instagramID}
              </a>
            </div>
          )}
          {contact.twitterID && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Twitter</p>
              <a href={contact.twitterID} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {contact.twitterID}
              </a>
            </div>
          )}
          {contact.doximityID && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Doximity</p>
              <p className="font-medium">{contact.doximityID}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}