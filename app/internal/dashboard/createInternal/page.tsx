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

// Import our custom components
import PersonalInformation from "@/components/AccountManager/personalInformation";
import JobInformation from "@/components/AccountManager/JobInformation";
import LocationInformation from "@/components/AccountManager/LocationInformation";
import ContactInformation from "@/components/AccountManager/contactInformation";
import SocialMedia from "@/components/AccountManager/SocialMedia";
import FormActions from "@/components/AccountManager/FormActions";

// Phone number regex that accepts both US and Indian formats
const phoneRegex = /^(\+?1[\s-]?)?(\([0-9]{3}\)|[0-9]{3})[\s-]?[0-9]{3}[\s-]?[0-9]{4}$|^(\+91[\s-]?)?[6789]\d{9}$/;

// URL regex
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

const formSchema = z.object({
  // Store user ID for image upload
  id: z.string().optional(),
  // Temporary field to store the selected file (not sent to API)
  _tempImageFile: z.any().optional(),
  // Basic Information
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  profileImageUrl: z.string().optional(),
  userRole: z.string().min(1, "User type is required"),
  jobRole: z.string().optional(),
  jobDepartment: z.string().optional(),
  regionAllocated: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  zipcode: z.string().optional(),
  streetAddress: z.string().optional(),
  mapLink: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  divisionalGroup: z.string().optional(),
  division: z.string().optional(),
  subdivision: z.string().optional(),
  sector: z.string().optional(),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  phoneNo: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
  alternatePhone: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
  faxNo: z.string().optional(),
  linkedinId: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  facebookId: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  instagramId: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  twitterId: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
});

export default function CreateInternalAccount() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepMessage, setStepMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      profileImageUrl: "",
      userRole: "",
      email: "",
      jobRole: "",
      jobDepartment: "",
      regionAllocated: "",
      state: "",
      city: "",
      county: "",
      zipcode: "",
      streetAddress: "",
      mapLink: "",
      divisionalGroup: "",
      division: "",
      subdivision: "",
      sector: "",
      phoneNo: "",
      alternatePhone: "",
      faxNo: "",
      linkedinId: "",
      facebookId: "",
      instagramId: "",
      twitterId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setApiError(null);
    setStepMessage("Creating user account...");

    try {
      // Step 1: Remove the temporary file field before sending to API
      const submitValues = { ...values };
      const tempFile = submitValues._tempImageFile;
      delete submitValues._tempImageFile;

      console.log("Submitting initial values:", submitValues);

      // Step 2: Create the user
      const response = await fetch('/api/AccountManager/WAVInternalUser', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create account");
      }

      // Get the response data
      const userData = await response.json();
      console.log("User creation response:", userData);

      // The response only contains a success message, not the ID
      // We need to fetch the newly created user by email to get the ID
      if (!userData.id) {
        setStepMessage("Retrieving user information...");

        // Make a GET request to fetch the user by email
        const getUsersResponse = await fetch('/api/AccountManager/WAVInternalUser', {
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
        console.log("Retrieved users:", allUsers);

        // Find the user with the matching email
        const email = submitValues.email;
        const createdUser = Array.isArray(allUsers) ?
          allUsers.find(user => user.email === email) : null;

        if (!createdUser || !createdUser.id) {
          console.log("Could not find user with email:", email);
          console.log("Available users:", JSON.stringify(allUsers, null, 2));
          throw new Error("Could not find newly created user");
        }

        // Now we have the user ID
        const userId = createdUser.id;
        console.log("Found user ID:", userId);

        // Step 3: If we have a file to upload, do that now
        if (tempFile) {
          try {
            setStepMessage("Uploading profile image...");

            // Create form data for the image upload
            const formData = new FormData();
            formData.append('file', tempFile);

            // Upload the image
            const uploadUrl = `/api/ImageUploadInternal/upload/${userId}`;
            const uploadResponse = await fetch(uploadUrl, {
              method: 'POST',
              body: formData,
            });

            if (!uploadResponse.ok) {
              throw new Error("Failed to upload image");
            }

            const uploadData = await uploadResponse.json();
            console.log("Upload response:", uploadData);

            if (uploadData.imageUrl) {
              setStepMessage("Updating user with image URL...");

              // Update the user with the image URL
              const updateResponse = await fetch('/api/AccountManager/WAVInternalUser', {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...submitValues,
                  id: userId,
                  profileImageUrl: uploadData.imageUrl
                }),
              });

              if (!updateResponse.ok) {
                throw new Error("Failed to update user with image URL");
              }

              console.log("User updated with image URL");
            }
          } catch (error) {
            console.error("Error in image upload process:", error);
            // We'll continue even if image upload fails - the user is already created
            toast.error("Account created but profile image could not be uploaded");
          }
        }
      } else {
        // If we did get an ID directly in the response (for future-proofing)
        const userId = userData.id;
        console.log("Got user ID directly:", userId);

        // Handle image upload if needed (same code as above)
        if (tempFile) {
          try {
            setStepMessage("Uploading profile image...");

            const formData = new FormData();
            formData.append('file', tempFile);

            const uploadUrl = `/api/ImageUploadInternal/upload/${userId}`;
            const uploadResponse = await fetch(uploadUrl, {
              method: 'POST',
              body: formData,
            });

            if (!uploadResponse.ok) {
              throw new Error("Failed to upload image");
            }

            const uploadData = await uploadResponse.json();

            if (uploadData.imageUrl) {
              setStepMessage("Updating user with image URL...");

              const updateResponse = await fetch('/api/AccountManager/WAVInternalUser', {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ...submitValues,
                  id: userId,
                  profileImageUrl: uploadData.imageUrl
                }),
              });

              if (!updateResponse.ok) {
                throw new Error("Failed to update user with image URL");
              }
            }
          } catch (error) {
            console.error("Error in image upload process:", error);
            toast.error("Account created but profile image could not be uploaded");
          }
        }
      }

      setApiError(null);
      setStepMessage(null);
      toast.success("Account created successfully", {
        description: "The internal account has been created",
        duration: 3000,
      });

      // Set the account tab preference to internal before redirecting
      localStorage.setItem("accountTabPreference", "internal");

      // Wait for a moment to show the success message before redirecting
      setTimeout(() => {
        router.push("/internal/dashboard/account");
      }, 1000);
    } catch (error) {
      console.error("Error creating account:", error);
      setApiError(error instanceof Error ? error.message : "Failed to create account");
      toast.error(error instanceof Error ? error.message : "Failed to create account");
    } finally {
      setIsSubmitting(false);
      setStepMessage(null);
    }
  }

  return (
    <ExternalLayout>
      <div className="space-y-6 pb-8">
        <div className="border-b pb-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Create Internal Account</span>
          </div>
          <h1 className="text-2xl font-semibold mt-2">Create Internal Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details below to create a new internal account
          </p>
        </div>

        {apiError && <div className="text-red-500">{apiError}</div>}
        {stepMessage && <div className="text-blue-500">{stepMessage}</div>}

        <div className="max-w-[1200px] mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <PersonalInformation
                form={form}
                requiredFields={["email"]}
              />

              {/* Job Information */}
              <JobInformation
                form={form}
                requiredFields={["userRole"]}
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
                addressField="streetAddress"
                zipcodeField="zipcode"
              />

              {/* Contact Information */}
              <ContactInformation
                form={form}
                phoneField="phoneNo"
                faxField="faxNo"
              />

              {/* Social Media */}
              <SocialMedia
                form={form}
                fieldNames={{
                  linkedin: "linkedinId",
                  facebook: "facebookId",
                  instagram: "instagramId",
                  twitter: "twitterId"
                }}
              />

              {/* Form Actions */}
              <FormActions
                isSubmitting={isSubmitting}
                onCancel={() => {
                  // Set preference before redirecting back
                  localStorage.setItem("accountTabPreference", "internal");
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