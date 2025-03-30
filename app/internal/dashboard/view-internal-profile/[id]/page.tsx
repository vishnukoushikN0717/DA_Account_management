"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExternalLayout from "../../../InternalLayout";
import {
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Share2,
  Calendar,
  X,
  Users,
  Building2,
  Map,
  UserCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
// import { dummyInternalUser } from "@/lib/dummy-data";

interface UserProfile {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  userRole: string;
  jobRole: string;
  jobDepartment: string;
  regionAllocated: string;
  state: string;
  city: string;
  county: string;
  zipCode: string;
  address: string;
  mapLink: string;
  divisionalGroup: string;
  division: string;
  subdivision: string;
  sector: string;
  email: string;
  phone: string;
  alternatePhone: string;
  faxNumber: string;
  linkedinID: string;
  facebookID: string;
  instagramID: string;
  twitterID: string;
}

export default function InternalUserProfile() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = params.id as string;
        console.log('Fetching user with ID:', id);

        const response = await fetch(`/api/AccountManager/WAVInternalUser/${id}`, {
          method: 'GET',
          headers: {
            'accept': '*/*',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch user data');
      }
    };

    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/edit-internal-profile/${params.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const id = params.id as string;
      const response = await fetch(`/api/AccountManager/WAVInternalUser/${id}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }

      toast.success("User deleted successfully");
      router.push('/internal/user');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!params.id) {
    return <div>Error: No ID provided</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4">
        Loading...
      </div>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <ExternalLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <span className="text-blue-600 dark:text-blue-400 font-medium">Dashboard</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Internal Profile</span>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="border dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-6">
                <div>
                  <h1 className="text-2xl font-bold dark:text-gray-200">
                    {[user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ')}
                  </h1>
                  <p className="text-muted-foreground">{user.userRole || 'No role specified'}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      {user.email}
                    </span>
                    {user.phone && (
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        {user.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800 py-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Personal Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium dark:text-gray-200">{user.dob || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium dark:text-gray-200">{user.gender || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800 py-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Job Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Job Role</p>
                  <p className="font-medium dark:text-gray-200">{user.jobRole || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Job Role</p>
                  <p className="font-medium dark:text-gray-200">{user.jobRole || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium dark:text-gray-200">{user.jobDepartment || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800 py-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Location Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Region Allocated</p>
                  <p className="font-medium dark:text-gray-200">{user.regionAllocated || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">State</p>
                  <p className="font-medium dark:text-gray-200">{user.state || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium dark:text-gray-200">{user.city || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">County</p>
                  <p className="font-medium dark:text-gray-200">{user.county || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Zipcode</p>
                  <p className="font-medium dark:text-gray-200">{user.zipCode || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Street Address</p>
                  <p className="font-medium dark:text-gray-200">{user.address || '-'}</p>
                </div>
                {user.mapLink && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Map Link</p>
                    <a href={user.mapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                      View Location
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Organization Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800 py-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Location Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Divisional Group</p>
                  <p className="font-medium dark:text-gray-200">{user.divisionalGroup || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Division</p>
                  <p className="font-medium dark:text-gray-200">{user.division || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subdivision</p>
                  <p className="font-medium dark:text-gray-200">{user.subdivision || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sector</p>
                  <p className="font-medium dark:text-gray-200">{user.sector || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800 py-3">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Contact Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium dark:text-gray-200">{user.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alternate Phone</p>
                  <p className="font-medium dark:text-gray-200">{user.alternatePhone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fax Number</p>
                  <p className="font-medium dark:text-gray-200">{user.faxNumber || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800 py-3">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Social Media
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {user.linkedinID && (
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                    <a href={user.linkedinID} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                      View Profile
                    </a>
                  </div>
                )}
                {user.facebookID && (
                  <div>
                    <p className="text-sm text-muted-foreground">Facebook</p>
                    <a href={user.facebookID} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                      View Profile
                    </a>
                  </div>
                )}
                {user.instagramID && (
                  <div>
                    <p className="text-sm text-muted-foreground">Instagram</p>
                    <a href={user.instagramID} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                      View Profile
                    </a>
                  </div>
                )}
                {user.twitterID && (
                  <div>
                    <p className="text-sm text-muted-foreground">Twitter</p>
                    <a href={user.twitterID} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                      View Profile
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ExternalLayout>
  );
}