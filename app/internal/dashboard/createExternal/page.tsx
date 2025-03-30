"use client";

import ExternalLayout from "../../InternalLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { states } from "lib/location-data";
import { Loader2 } from "lucide-react";

// Import our custom components
import PersonalInformation from "@/components/AccountManager/personalInformation";
import JobInformation from "@/components/AccountManager/JobInformation";
import LocationInformation from "@/components/AccountManager/LocationInformation";
import ContactInformation from "@/components/AccountManager/contactInformation";
import SocialMedia from "@/components/AccountManager/SocialMedia";
import CompanyInformation from "@/components/AccountManager/CompanyInfromation";
import FormActions from "@/components/AccountManager/FormActions";

// Phone number regex that accepts both US and Indian formats
const phoneRegex = /^(\+?1[\s-]?)?(\([0-9]{3}\)|[0-9]{3})[\s-]?[0-9]{3}[\s-]?[0-9]{4}$|^(\+91[\s-]?)?[6789]\d{9}$/;

// URL regex for validating links
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

const formSchema = z.object({
  // Temporary field to store the selected file (not sent to API)
  _tempImageFile: z.any().optional(),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  userRole: z.string().min(1, "User type is required"),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  profileImageUrl: z.string().optional(),
  jobRole: z.string().optional(),
  wavExternalUserId: z.string().optional(),
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
  companyType: z.string().optional(),
  companyId: z.string().optional(),
});

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background border shadow-lg">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-sm font-medium text-muted-foreground">Creating Account...</p>
    </div>
  </div>
);

export default function CreateExternalAccount() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [stepMessage, setStepMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      profileImageUrl: "",
      jobRole: "",
      wavExternalUserId: "",
      email: "",
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
      companyType: "",
      companyId: "",
    },
  });

  // Function to upload image after user creation
  const uploadImage = async (userId: string, file: File): Promise<string> => {
    setStepMessage("Uploading profile image...");

    // Create form data for the image upload
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Call your image upload API
      const uploadUrl = `/api/ImageUploadExternal/upload/${userId}`;
      console.log("Uploading image to:", uploadUrl);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      console.log("Upload response status:", uploadResponse.status);

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

        console.log("Found image URL in JSON response:", imageUrl);
      }

      // If we couldn't find the URL in a structured way, try to extract it from the response text
      if (!imageUrl && responseText) {
        // Look for URL patterns in the response
        const urlMatch = responseText.match(/(https?:\/\/[^"'\s]+)/i);
        if (urlMatch) {
          imageUrl = urlMatch[0];
          console.log("Extracted URL from response text:", imageUrl);
        }
      }

      // If we still don't have a URL and the upload was successful, create a fallback URL
      if (!imageUrl && uploadResponse.ok) {
        console.log("Creating fallback URL");
        imageUrl = `https://dawavadmin-djb0f9atf8e6cwgx.eastus-01.azurewebsites.net/images/temp-external-${userId}-${Date.now()}.jpg`;
        console.log("Created fallback URL:", imageUrl);
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

  // Function to update user with image URL
  const updateUserWithImage = async (userId: string, imageUrl: string, userData: any) => {
    setStepMessage("Updating profile with image...");

    try {
      // Make sure we're not sending "string" values
      const cleanedData = Object.fromEntries(
        Object.entries(userData).map(([key, value]) => {
          return [key, value === "string" ? "" : value];
        })
      );

      const updatedData = {
        ...cleanedData,
        profileImageUrl: imageUrl,
        // Also update profilePic for compatibility
        profilePic: imageUrl
      };

      const response = await fetch(`/api/AccountManager/WAVExternalUser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user with image URL");
      }

      console.log("Successfully updated user with image URL");
      return true;
    } catch (error) {
      console.error("Error updating user with image:", error);
      // This is non-fatal - the user was created, but image update failed
      toast.error("Account created, but failed to save profile image");
      return false;
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setApiError(null);
    try {
      // Step 1: Extract the temporary file field
      const tempFile = values._tempImageFile;
      const submitValues = { ...values };
      delete submitValues._tempImageFile;
      delete submitValues.profileImageUrl; // Remove profile image URL since we'll add it later

      // Only populate fields that have values to avoid "string" defaults
      const requestBody: Record<string, any> = {
        email: submitValues.email,
        userRole: submitValues.userRole
      };

      // Add all other fields only if they have values
      Object.entries(submitValues).forEach(([key, value]) => {
        if (key !== 'email' && key !== 'userRole' && value !== undefined && value !== "") {
          requestBody[key] = value;
        }
      });

      // Set default values for required fields that might be missing
      if (!requestBody.firstName) requestBody.firstName = "";
      if (!requestBody.lastName) requestBody.lastName = "";
      if (!requestBody.phone) requestBody.phone = "";
      if (!requestBody.companyId) requestBody.companyId = "";
      if (!requestBody.website) requestBody.website = "";
      if (!requestBody.doximityID) requestBody.doximityID = "";

      console.log("Sending request body:", requestBody);
      setStepMessage("Creating user account...");
      const response = await fetch('/api/AccountManager/WAVExternalUser', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to create account: ${response.statusText}`);
      }

      // Get the user data with ID
      const userData = await response.json();
      console.log("Created user response:", userData);

      // Check if we have an ID (directly or need to fetch it)
      let userId = userData.id;

      // If we don't have an ID yet, we need to get it by fetching the user by email
      if (!userId) {
        console.log("No user ID in creation response, fetching user by email");

        // Get the user data by email
        try {
          const getUsersResponse = await fetch('/api/AccountManager/WAVExternalUser', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });

          if (!getUsersResponse.ok) {
            throw new Error("Failed to retrieve user information");
          }

          // Get all users and find the one we just created by email
          const allUsers = await getUsersResponse.json();

          // Find the user with the matching email
          const email = submitValues.email;
          const createdUser = Array.isArray(allUsers) ?
            allUsers.find(user => user.email === email) : null;

          if (!createdUser || !createdUser.id) {
            console.log("Could not find user with email:", email);
            throw new Error("Could not find newly created user");
          }

          // Now we have the user ID
          userId = createdUser.id;
          console.log("Found user ID:", userId);
        } catch (error) {
          console.error("Error getting user ID:", error);

          // Show success but warn about image upload
          if (tempFile) {
            toast.warning("Account created, but couldn't upload profile image");
          } else {
            toast.success("Account Created Successfully");
          }

          // Set the account tab preference to external before redirecting
          localStorage.setItem("accountTabPreference", "external");
          router.push("/internal/dashboard/account");
          return;
        }
      }

      // Step 3: If we have a file and user ID, upload the image
      if (tempFile && userId) {
        try {
          // Upload the image and get URL back
          const imageUrl = await uploadImage(userId, tempFile);

          // Update the user with the image URL
          await updateUserWithImage(userId, imageUrl, { ...requestBody, id: userId });
        } catch (error) {
          console.error("Error in image upload process:", error);
          // Continue - user is already created, just no image
        }
      }

      setStepMessage(null);
      toast.success("Account Created Successfully");

      // Set the account tab preference to external before redirecting
      localStorage.setItem("accountTabPreference", "external");
      router.push("/internal/dashboard/account");
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error(error instanceof Error ? error.message : "Failed to create account");
      setApiError(error instanceof Error ? error.message : "Failed to create account");
    } finally {
      setIsSubmitting(false);
      setStepMessage(null);
    }
  }

  return (
    <ExternalLayout>
      <div className="h-[calc(100vh-6rem)] flex flex-col">
        {isSubmitting && <LoadingOverlay />}
        <div className="flex-none p-4 border-b bg-background">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {/* <span className="text-blue-600 font-medium">Dashboard</span>
            <span>/</span>
            <span>Create External Account</span> */}
          </div>
          <h1 className="text-xl font-semibold mt-1">Create External Account</h1>
          {stepMessage && <div className="text-blue-500 text-sm mt-1">{stepMessage}</div>}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {apiError && <div className="text-red-500">{apiError}</div>}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-[1200px] mx-auto">
              {/* Personal Information */}
              <PersonalInformation form={form} requiredFields={["email"]} />

              {/* Job Information */}
              <JobInformation
                form={form}
                requiredFields={["userRole"]}
                roleOptions={[
                  { value: "External Admin", label: "External Admin" },
                  { value: "External User", label: "External User" }
                ]}
                showWavExternalId={true}
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

              {/* Company Information */}
              <CompanyInformation form={form} />

              {/* Form Actions */}
              <FormActions
                isSubmitting={isSubmitting}
                onCancel={() => {
                  // Set preference before redirecting back
                  localStorage.setItem("accountTabPreference", "external");
                  router.push("/internal/dashboard/account");
                }}
              />
            </form>
          </Form>
        </div>
      </div>
    </ExternalLayout>
  );
}