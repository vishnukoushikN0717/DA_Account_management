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

interface UserProfile {
  profilePic: string | undefined;
  profileImageUrl: string | undefined;
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  userRole: string;
  jobRole: string;
  wavExternalUserId: string;
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
  profileImage?: string;
}

export default function ExternalUserProfile() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = params.id as string;
        console.log('[Page Component] Fetching user with ID:', id);
        const apiUrl = `/api/AccountManager/WAVExternalUser/${id}`;
        console.log('[Page Component] API URL:', apiUrl);

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'accept': '*/*',
          },
        });

        console.log('[Page Component] Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('[Page Component] Error response:', errorText);
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[Page Component] Successfully fetched data:', data);

        // Fix for the TypeScript error when cleaning data
        const cleanedData = Object.fromEntries(
          Object.entries(data).map(([key, value]) => {
            return [key, value === "string" ? "" : value];
          })
        ) as unknown as UserProfile;  // First cast to unknown, then to UserProfile

        setUser(cleanedData);
      } catch (error) {
        console.error('[Page Component] Error fetching user:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch user data');
      }
    };

    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  const handleEdit = () => {
    router.push(`/internal/dashboard/edit-external-profile/${params.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const id = params.id as string;
      const response = await fetch(`/api/AccountManager/WAVExternalUser/${id}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }

      toast.success("User deleted successfully");
      router.push('/internal/dashboard/account');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  // Get the profile image URL - use profileImageUrl first, then profilePic
  const profileImage = user.profileImageUrl || user.profilePic || user.profileImage;

  return (
    <ExternalLayout>
      <div className="space-y-6 p-6 max-w-[1200px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <span className="text-blue-600 dark:text-blue-400 font-medium">Dashboard</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">External Profile</span>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/internal/dashboard/account')}
            className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
          >
            <Users className="h-4 w-4" />
            Go to Accounts
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="border dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-gray-100 dark:border-gray-800">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback className="text-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {[user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ')}
                  </h1>
                  <p className="text-muted-foreground">{user.userRole || 'No role specified'}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      {user.email}
                    </span>
                    {user.phone && (
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        {user.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
                  onClick={handleEdit}
                >
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Profile
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the user
                        account and remove all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Personal Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{user.dob || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{user.gender || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Job Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Job Title</p>
                  <p className="font-medium">{user.jobRole || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Job Role</p>
                  <p className="font-medium">{user.jobRole || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WAV External ID</p>
                  <p className="font-medium">{user.wavExternalUserId || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Location Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">State</p>
                  <p className="font-medium">{user.state || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">City</p>
                  <p className="font-medium">{user.city || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">County</p>
                  <p className="font-medium">{user.county || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Zipcode</p>
                  <p className="font-medium">{user.zipCode || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Street Address</p>
                  <p className="font-medium">{user.address || '-'}</p>
                </div>
                {user.mapLink && user.mapLink !== "string" && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Map Link</p>
                    <a href={user.mapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Location
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Organization Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Location Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Divisional Group</p>
                  <p className="font-medium">{user.divisionalGroup || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Division</p>
                  <p className="font-medium">{user.division || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subdivision</p>
                  <p className="font-medium">{user.subdivision || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sector</p>
                  <p className="font-medium">{user.sector || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Contact Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium">{user.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alternate Phone</p>
                  <p className="font-medium">{user.alternatePhone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fax Number</p>
                  <p className="font-medium">{user.faxNumber || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Social Media
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {user.linkedinID && user.linkedinID !== "string" && (
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn</p>
                    <a href={user.linkedinID} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Profile
                    </a>
                  </div>
                )}
                {user.facebookID && user.facebookID !== "string" && (
                  <div>
                    <p className="text-sm text-muted-foreground">Facebook</p>
                    <a href={user.facebookID} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Profile
                    </a>
                  </div>
                )}
                {user.instagramID && user.instagramID !== "string" && (
                  <div>
                    <p className="text-sm text-muted-foreground">Instagram</p>
                    <a href={user.instagramID} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Profile
                    </a>
                  </div>
                )}
                {user.twitterID && user.twitterID !== "string" && (
                  <div>
                    <p className="text-sm text-muted-foreground">Twitter</p>
                    <a href={user.twitterID} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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