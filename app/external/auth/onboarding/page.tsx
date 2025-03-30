"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  alternatePhone: string;
  companyRole: string;
  zipCode: string;
  dob: string;
  gender: string;
  faxNumber: string;
  linkedinID: string;
  facebookID: string;
  instagramID: string;
  twitterID: string;
}

// Define a type for the request body that includes all possible fields
interface UpdateUserRequest {
  email: string;
  userRole: string;
  [key: string]: string | undefined; // Allow any additional optional fields
}

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    phoneNumber: "",
    alternatePhone: "",
    companyRole: "",
    zipCode: "",
    dob: "",
    gender: "",
    faxNumber: "",
    linkedinID: "",
    facebookID: "",
    instagramID: "",
    twitterID: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || !session) {
      console.error("No session found. Redirecting to login.");
      router.push("/external/auth/otp-login");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.role !== "external") {
        console.error("User is not an external user. Redirecting.");
        router.push("/auth/otp-login");
      } else if (session.user.onboarderStatus) {
        console.log("User already onboarded. Redirecting to dashboard.");
        router.push("/external/dashboard");
      }
    }
  }, [status, session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.lastName?.trim() ||
      !formData.phoneNumber?.trim() ||
      !formData.dob?.trim() ||
      !formData.gender?.trim()
    ) {
      setMessage({ text: "Please fill all required fields", type: "error" });
      return false;
    }

    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    const normalizedPhone = formData.phoneNumber.replace(/[\s-()]/g, "");
    if (!phoneRegex.test(normalizedPhone)) {
      setMessage({ text: "Invalid phone number format", type: "error" });
      return false;
    }

    if (formData.zipCode) {
      const zipRegex = /^\d{5}(\d{4})?$/;
      const normalizedZip = formData.zipCode.replace(/[- ]/g, "");
      if (!zipRegex.test(normalizedZip)) {
        setMessage({
          text: "ZIP code must be either 5 digits (12345) or 9 digits (123456789)",
          type: "error",
        });
        return false;
      }
    }

    const dobDate = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (age < 18 || age > 100) {
      setMessage({ text: "Age must be between 18 and 100 years", type: "error" });
      return false;
    }

    if (formData.alternatePhone) {
      const normalizedAltPhone = formData.alternatePhone.replace(/[\s-()]/g, "");
      if (!phoneRegex.test(normalizedAltPhone)) {
        setMessage({ text: "Invalid alternate phone number format", type: "error" });
        return false;
      }
    }

    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    if (formData.linkedinID && !urlRegex.test(formData.linkedinID)) {
      setMessage({ text: "Invalid LinkedIn URL", type: "error" });
      return false;
    }

    return true;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (status !== "authenticated" || !session?.user) {
        throw new Error("User not authenticated");
      }

      const userData = session.user;
      console.log("Session user data:", userData);

      if (!userData.id || !userData.email) {
        console.error("Missing required user data:", userData);
        throw new Error("Missing required user data");
      }

      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.phoneNumber ||
        !formData.dob ||
        !formData.gender
      ) {
        console.error("Missing required form data:", formData);
        throw new Error("Please fill all required fields");
      }

      // Step 1: Update form data with PUT request
      const requestBody: UpdateUserRequest = {
        email: userData.email,
        userRole: userData.userRole || "User",
      };

      if (formData.firstName) requestBody.firstName = formData.firstName;
      if (formData.lastName) requestBody.lastName = formData.lastName;
      if (formData.phoneNumber) requestBody.phone = formData.phoneNumber;
      if (formData.dob) requestBody.dob = formatDate(formData.dob);
      if (formData.gender) requestBody.gender = formData.gender;
      if (formData.zipCode) requestBody.zipCode = formData.zipCode;
      if (formData.companyRole) requestBody.jobRole = formData.companyRole;
      if (formData.faxNumber) requestBody.faxNumber = formData.faxNumber;
      if (formData.linkedinID) requestBody.linkedinID = formData.linkedinID;
      if (formData.twitterID) requestBody.twitterID = formData.twitterID;
      if (formData.facebookID) requestBody.facebookID = formData.facebookID;
      if (formData.instagramID) requestBody.instagramID = formData.instagramID;
      if (formData.middleName) requestBody.middleName = formData.middleName;
      if (formData.alternatePhone) requestBody.alternatePhone = formData.alternatePhone;

      console.log("PUT Request Body (Form Data):", requestBody);

      const putResponse = await fetch(`/api/AccountManager/WAVExternalUser/${userData.id}`, {
        method: "PUT",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const putResponseText = await putResponse.text();
      console.log("PUT Raw response (Form Data):", putResponseText);

      let putResponseData;
      try {
        putResponseData = putResponseText ? JSON.parse(putResponseText) : null;
      } catch (e) {
        console.error("Failed to parse PUT response (Form Data):", e, "Raw response:", putResponseText);
        throw new Error("Invalid response from PUT server (Form Data)");
      }

      if (!putResponse.ok) {
        throw new Error(
          putResponseData?.error || putResponseData?.message || "Failed to update profile"
        );
      }

      // Step 2: Update onboarderStatus with the new PUT request (no body)
      const onboarderStatusUrl = `/api/AccountManager/WAVExternalUser/update-onboarder-status/${encodeURIComponent(
        userData.email
      )}`;
      const onboarderStatusResponse = await fetch(onboarderStatusUrl, {
        method: "PUT",
        headers: {
          "accept": "*/*",
        },
      });

      const onboarderStatusResponseText = await onboarderStatusResponse.text();
      console.log("PUT Raw response (Onboarder Status):", onboarderStatusResponseText);

      let onboarderStatusResponseData;
      try {
        onboarderStatusResponseData = onboarderStatusResponseText
          ? JSON.parse(onboarderStatusResponseText)
          : null;
      } catch (e) {
        console.error(
          "Failed to parse PUT response (Onboarder Status):",
          e,
          "Raw response:",
          onboarderStatusResponseText
        );
        throw new Error("Invalid response from PUT server (Onboarder Status)");
      }

      if (!onboarderStatusResponse.ok) {
        throw new Error(
          onboarderStatusResponseData?.error ||
          onboarderStatusResponseData?.message ||
          "Failed to update onboarder status"
        );
      }

      // Step 3: Refetch session to update frontend state
      const updatedSessionResponse = await fetch("/api/auth/session", {
        credentials: "include",
      });
      const updatedSessionData = await updatedSessionResponse.json();
      console.log("Updated Session Data:", updatedSessionData);

      if (updatedSessionData?.user?.onboarderStatus !== true) {
        console.warn("Backend did not update onboarderStatus. Please check API implementation.");
      }

      setMessage({ text: "Profile updated successfully! Redirecting...", type: "success" });

      setTimeout(() => {
        router.push("/external/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Update error:", error);
      setMessage({
        text: error instanceof Error ? error.message : "Failed to update profile",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container relative h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-8 w-full max-w-[450px]">
          <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative h-screen flex lg:grid lg:max-w-none lg:grid-cols-[60%_40%] lg:px-0">
      <div className="relative hidden lg:block h-screen">
        <div className="absolute inset-0">
          <img
            src="/assets/Doctors_small.jpg"
            alt="Medical professionals"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-100 mix-blend-multiply" />
        </div>
      </div>

      <div className="relative flex flex-col h-screen overflow-y-auto">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px] p-8">
          <img src="/assets/da-logo.png" alt="DA LOGO" />

          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Complete Your Profile</h1>
            <p className="text-sm text-muted-foreground">
              Please provide your details to complete the registration
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 w-full max-w-[450px]">
            {message && (
              <div
                className={`text-sm text-center p-2 rounded-md ${message.type === "success"
                  ? "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
                  : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
                  }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-blue-100 focus-visible:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  placeholder="Doe"
                  type="text"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-blue-100 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-blue-100 focus-visible:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1234567890"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-blue-100 focus-visible:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternatePhone">Alternate Phone</Label>
                <Input
                  id="alternatePhone"
                  placeholder="+1234567890"
                  type="tel"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-blue-100 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyRole">Role</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("companyRole", value)}
                  value={formData.companyRole}
                >
                  <SelectTrigger className="border-blue-100 focus:ring-blue-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="12345 or 123456789"
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 9) {
                      handleInputChange({
                        target: { id: "zipCode", value },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }
                  }}
                  disabled={isLoading}
                  className="border-blue-100 focus-visible:ring-blue-500"
                  maxLength={9}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-blue-100 focus-visible:ring-blue-500"
                  required
                  placeholder="MM/DD/YYYY"
                  pattern="\d{2}/\d{2}/\d{4}"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  value={formData.gender}
                  required
                >
                  <SelectTrigger className="border-blue-100 focus:ring-blue-500">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="faxNumber">Fax Number</Label>
                <Input
                  id="faxNumber"
                  placeholder="+1234567890"
                  type="tel"
                  value={formData.faxNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-blue-100 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinID">LinkedIn ID</Label>
                <Input
                  id="linkedinID"
                  placeholder="https://www.linkedin.com/in/username"
                  type="url"
                  value={formData.linkedinID}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-blue-100 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookID">Facebook ID</Label>
                <Input
                  id="facebookID"
                  placeholder="https://www.facebook.com/username"
                  type="url"
                  value={formData.facebookID}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-blue-100 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagramID">Instagram ID</Label>
                <Input
                  id="instagramID"
                  placeholder="https://www.instagram.com/username"
                  type="url"
                  value={formData.instagramID}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-blue-100 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterID">Twitter ID</Label>
                <Input
                  id="twitterID"
                  placeholder="https://www.twitter.com/username"
                  type="url"
                  value={formData.twitterID}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-blue-100 focus-visible:ring-blue-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading && (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                )}
                Complete Registration
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}