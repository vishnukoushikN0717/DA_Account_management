"use client";

import { Card } from "@/components/ui/card";
import {
  MapPin,
  Mail,
  Phone,
  Users,
  FileText,
  Briefcase,
  Activity,
  Network,
  User,
  Globe,
  Stethoscope,
} from "lucide-react";
import { Practitioner } from "@/types/practitioner";

interface InformationTabProps {
  practitioner: Practitioner;
}

export function InformationTab({ practitioner }: InformationTabProps) {
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
            <p className="font-medium">{practitioner.firstName}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Last Name</p>
            <p className="font-medium">{practitioner.lastName}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Job Title</p>
            <p className="font-medium">{practitioner.jobTitle}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">NPI Number</p>
            <p className="font-medium">{practitioner.individualNpi}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Practitioner Type</p>
            <p className="font-medium">{practitioner.practitionerType}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Persona Type</p>
            <p className="font-medium">{practitioner.personaType}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Lifecycle Stage</p>
            <p className="font-medium">{practitioner.practitionerLifecycleStage}</p>
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
            <p className="font-medium">{practitioner.email}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <p className="text-sm text-gray-500">Phone</p>
            </div>
            <p className="font-medium">{practitioner.phoneNo}</p>
          </div>
          {practitioner.alternatePhone && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-500">Alternate Phone</p>
              </div>
              <p className="font-medium">{practitioner.alternatePhone}</p>
            </div>
          )}
          {practitioner.faxNo && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-500">Fax</p>
              </div>
              <p className="font-medium">{practitioner.faxNo}</p>
            </div>
          )}
          {practitioner.website && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-500">Website</p>
              </div>
              <a href={practitioner.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {practitioner.website}
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
            <p className="font-medium">{practitioner.streetAddress}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">City</p>
            <p className="font-medium">{practitioner.city}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">State</p>
            <p className="font-medium">{practitioner.state}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">County</p>
            <p className="font-medium">{practitioner.county}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">ZIP Code</p>
            <p className="font-medium">{practitioner.zipcode}</p>
          </div>
          {practitioner.mapLink && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Map Link</p>
              <a href={practitioner.mapLink} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                View on Map
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Practitioner Metrics */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Practitioner Metrics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">Total Patients</p>
            </div>
            <p className="text-xl font-semibold">{practitioner.noOfTotalPatients}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">Pending Orders</p>
            </div>
            <p className="text-xl font-semibold">{practitioner.noOfPendingOrders}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">Associated Practices</p>
            </div>
            <p className="text-xl font-semibold">{practitioner.noOfPracticesAssociated}</p>
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
          {practitioner.linkedInID && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">LinkedIn</p>
              <a href={practitioner.linkedInID} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {practitioner.linkedInID}
              </a>
            </div>
          )}
          {practitioner.facebookID && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Facebook</p>
              <a href={practitioner.facebookID} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {practitioner.facebookID}
              </a>
            </div>
          )}
          {practitioner.instagramID && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Instagram</p>
              <a href={practitioner.instagramID} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {practitioner.instagramID}
              </a>
            </div>
          )}
          {practitioner.twitterID && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Twitter</p>
              <a href={practitioner.twitterID} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-700">
                {practitioner.twitterID}
              </a>
            </div>
          )}
          {practitioner.doximityID && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Doximity</p>
              <p className="font-medium">{practitioner.doximityID}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}