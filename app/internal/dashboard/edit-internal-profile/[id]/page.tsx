"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ExternalLayout from "../../../InternalLayout";
import { Form } from "@/components/ui/form";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { states } from "@/lib/location-data";

// Import our custom components
import PageHeader from "@/components/AccountManager/pageheader";
import AccountInformation from "@/components/AccountManager/AccountInformation";
import EditFormActions from "@/components/AccountManager/EditFormActions";
import PersonalInformation from "@/components/AccountManager/personalInformation";
import JobInformation from "@/components/AccountManager/JobInformation";
import LocationInformation from "@/components/AccountManager/LocationInformation";
import ContactInformation from "@/components/AccountManager/contactInformation";
import SocialMedia from "@/components/AccountManager/SocialMedia";

// Phone number regex that accepts both US and Indian formats
const phoneRegex = /^(\+?1[\s-]?)?(\([0-9]{3}\)|[0-9]{3})[\s-]?[0-9]{3}[\s-]?[0-9]{4}$|^(\+91[\s-]?)?[6789]\d{9}$/;

// URL regex for validating links
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

interface UserProfile {
  id: string;
  email: string;
  userRole: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
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
  phone: string;
  alternatePhone: string;
  faxNumber: string;
  linkedinID: string;
  facebookID: string;
  instagramID: string;
  twitterID: string;
  profileImageUrl: string;
}

const formSchema = z.object({
  // Temporary field to store the selected file (not sent to API)
  _tempImageFile: z.any().optional(),
  email: z.string().email("Invalid email format"),
  userRole: z.string().min(1, "User role is required"),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  profileImageUrl: z.string().optional(),
  jobRole: z.string().optional(),
  jobDepartment: z.string().optional(),
  regionAllocated: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  mapLink: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  divisionalGroup: z.string().optional(),
  division: z.string().optional(),
  subdivision: z.string().optional(),
  sector: z.string().optional(),
  phone: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
  alternatePhone: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
  faxNumber: z.string().optional(),
  linkedinID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  facebookID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  instagramID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  twitterID: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
});

export default function EditInternalProfile() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState<UserProfile | null>(null);
  const [stepMessage, setStepMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      userRole: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      profileImageUrl: "",
      jobRole: "",
      jobDepartment: "",
      regionAllocated: "",
      state: "",
      city: "",
      county: "",
      zipCode: "",
      address: "",
      mapLink: "",
      divisionalGroup: "",
      division: "",
      subdivision: "",
      sector: "",
      phone: "",
      alternatePhone: "",
      faxNumber: "",
      linkedinID: "",
      facebookID: "",
      instagramID: "",
      twitterID: "",
    }
  });

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
        setOriginalData(data);

        form.reset({
          email: data.email || "",
          userRole: data.userRole || "",
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          dob: data.dob || "",
          gender: data.gender || "",
          profileImageUrl: data.profileImageUrl || "",
          jobRole: data.jobRole || "",
          jobDepartment: data.jobDepartment || "",
          regionAllocated: data.regionAllocated || "",
          state: data.state || "",
          city: data.city || "",
          county: data.county || "",
          zipCode: data.zipCode || "",
          address: data.address || "",
          mapLink: data.mapLink || "",
          divisionalGroup: data.divisionalGroup || "",
          division: data.division || "",
          subdivision: data.subdivision || "",
          sector: data.sector || "",
          phone: data.phone || "",
          alternatePhone: data.alternatePhone || "",
          faxNumber: data.faxNumber || "",
          linkedinID: data.linkedinID || "",
          facebookID: data.facebookID || "",
          instagramID: data.instagramID || "",
          twitterID: data.twitterID || "",
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to fetch user data');
      }
    };

    if (params.id) {
      fetchUser();
    }
  }, [params.id, form]);

  // Function to upload image if needed
  // Function to upload image if needed
  const uploadImage = async (userId: string, file: File): Promise<string> => {
    setStepMessage("Uploading profile image...");

    // Create form data for the image upload
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Call your image upload API
      const uploadUrl = `/api/ImageUploadInternal/upload/${userId}`;

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      // Log the entire response for debugging
      const responseText = await uploadResponse.text();
      console.log("Raw upload response:", responseText);

      // Try to parse as JSON
      let uploadData;
      try {
        uploadData = JSON.parse(responseText);
        console.log("Parsed upload data:", uploadData);
      } catch (e) {
        console.log("Response is not valid JSON, trying to extract URL from text");
      }

      // Check for image URL in various formats
      let imageUrl = null;

      if (uploadData) {
        // Try different common property names for the URL
        imageUrl = uploadData.imageUrl || uploadData.url || uploadData.path ||
          uploadData.image || uploadData.filePath || uploadData.fileUrl;
      }

      // If we couldn't find the URL in a structured way, try to extract it from the response text
      if (!imageUrl && responseText) {
        // Look for URL patterns in the response
        const urlMatch = responseText.match(/(https?:\/\/[^"'\s]+)/i);
        if (urlMatch) {
          imageUrl = urlMatch[0];
        }
      }

      // If we still don't have a URL and the upload was successful, create a temporary one for testing
      if (!imageUrl && uploadResponse.ok) {
        console.log("Creating fallback URL for testing");
        // This is just for testing - replace with proper handling in production
        imageUrl = `https://dawavadmin-djb0f9atf8e6cwgx.eastus-01.azurewebsites.net/images/temp-${userId}-${Date.now()}.jpg`;
      }

      if (!imageUrl) {
        throw new Error("Could not extract image URL from server response");
      }

      console.log("Final image URL:", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Error uploading profile image");
      throw error;
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setStepMessage("Updating profile...");

    try {
      // Extract the temporary file field
      const tempFile = values._tempImageFile;
      const updatedValues = { ...values };
      delete updatedValues._tempImageFile;

      // If there's a new image file, upload it first
      if (tempFile) {
        try {
          const userId = params.id as string;
          setStepMessage("Uploading profile image...");

          // Upload the image
          const imageUrl = await uploadImage(userId, tempFile);
          console.log("Successfully uploaded image, got URL:", imageUrl);

          // Update the profileImageUrl with the new URL
          updatedValues.profileImageUrl = imageUrl;
        } catch (error) {
          console.error("Error uploading image:", error);
          // Continue with update even if image upload fails
          toast.error("Failed to upload profile image, but will continue updating other information");
        }
      }

      // Log the values we're about to send
      console.log("Updating user with values:", updatedValues);
      console.log("Profile image URL being sent:", updatedValues.profileImageUrl);

      // Make sure to include the ID in the updated data
      const userId = params.id as string;
      const updatedData = {
        ...updatedValues,
        id: userId  // Make sure ID is included
      };

      // Update the user profile
      console.log("Sending update with data:", updatedData);
      const response = await fetch(`/api/AccountManager/WAVInternalUser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify(updatedData),
      });

      console.log("Update API response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from update API:", errorText);
        throw new Error(`Failed to update profile: ${response.statusText}`);
      }

      // Try to get the response data
      let responseData;
      try {
        responseData = await response.json();
        console.log("Update API response data:", responseData);
      } catch (e) {
        console.log("Could not parse response as JSON");
      }

      setStepMessage(null);
      toast.success("Profile updated successfully");
      router.push(`/internal/dashboard/internal-profile/${userId}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
      setStepMessage(null);
    }
  }

  return (
    <ExternalLayout>
      <div className="space-y-6 p-6 max-w-[1200px] mx-auto">
        {/* Page Header with Breadcrumb */}
        <PageHeader
          title="Edit Internal Profile"
          onBackToAccounts={() => router.push('/internal/dashboard/account')}
        />

        {stepMessage && <div className="text-blue-500">{stepMessage}</div>}

        <div className="max-w-[1200px] mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Account Information */}
              <AccountInformation
                form={form}
                roleOptions={[
                  { value: "User", label: "User" },
                  { value: "SuperAdmin", label: "Super Admin" }
                ]}
              />

              {/* Personal Information */}
              <PersonalInformation form={form} />

              {/* Job Information */}
              <JobInformation
                form={form}
                roleOptions={[
                  { value: "Internal User", label: "Internal User" },
                  { value: "Super Admin", label: "Super Admin" }
                ]}
                showJobDepartment={true}
              />

              {/* Location Information */}
              <LocationInformation
                form={form}
                states={states}
                addressField="address"
                zipcodeField="zipCode"
              />

              {/* Contact Information */}
              <ContactInformation
                form={form}
                phoneField="phone"
                faxField="faxNumber"
              />

              {/* Social Media */}
              <SocialMedia
                form={form}
                fieldNames={{
                  linkedin: "linkedinID",
                  facebook: "facebookID",
                  instagram: "instagramID",
                  twitter: "twitterID"
                }}
              />

              {/* Form Actions */}
              <EditFormActions
                isLoading={isLoading}
                onCancel={() => router.back()}
              />
            </form>
          </Form>
        </div>
      </div>
    </ExternalLayout>
  );
}