"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
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

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const router = useRouter();

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
    // Required fields validation
    if (!formData.lastName?.trim() || !formData.phoneNumber?.trim() ||
      !formData.dob?.trim() || !formData.gender?.trim()) {
      setMessage({ text: "Please fill all required fields", type: 'error' });
      return false;
    }

    // Phone number validation
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    const normalizedPhone = formData.phoneNumber.replace(/[\s-()]/g, '');
    if (!phoneRegex.test(normalizedPhone)) {
      setMessage({ text: "Invalid phone number format", type: 'error' });
      return false;
    }

    // ZIP code validation (if provided)
    if (formData.zipCode) {
      const zipRegex = /^\d{5}(\d{4})?$/;
      const normalizedZip = formData.zipCode.replace(/[- ]/g, '');
      if (!zipRegex.test(normalizedZip)) {
        setMessage({
          text: "ZIP code must be either 5 digits (12345) or 9 digits (123456789)",
          type: 'error'
        });
        return false;
      }
    }

    // Date of birth validation with MM/DD/YYYY format
    const dobParts = formData.dob.split('-');
    if (dobParts.length !== 3) {
      setMessage({ text: "Invalid date format. Please use MM/DD/YYYY", type: 'error' });
      return false;
    }

    const dobDate = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();

    // Check if birthday has occurred this year
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (age < 18 || age > 100) {
      setMessage({ text: "Age must be between 18 and 100 years", type: 'error' });
      return false;
    }

    // Optional field validations
    if (formData.alternatePhone) {
      const normalizedAltPhone = formData.alternatePhone.replace(/[\s-()]/g, '');
      if (!phoneRegex.test(normalizedAltPhone)) {
        setMessage({ text: "Invalid alternate phone number format", type: 'error' });
        return false;
      }
    }

    // Social media URLs validation (if provided)
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    if (formData.linkedinID && !urlRegex.test(formData.linkedinID)) {
      setMessage({ text: "Invalid LinkedIn URL", type: 'error' });
      return false;
    }

    return true;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/auth/otp-login');
        return;
      }

      const userData = JSON.parse(storedUser);
      if (!userData.id || !userData.email || !userData.wavInternalUserId) {
        console.error('Missing required user data:', userData);
        throw new Error('Missing required user data');
      }

      if (!formData.firstName || !formData.lastName || !formData.phoneNumber ||
        !formData.dob || !formData.gender) {
        console.error('Missing required form data:', formData);
        throw new Error('Please fill all required fields');
      }

      const requestBody = {
        email: userData.email,
        userRole: userData.userRole,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phoneNumber,
        dob: formatDate(formData.dob),
        gender: formData.gender,
        address: "",
        city: "",
        state: "",
        zipCode: formData.zipCode || "",
        county: "",
        jobRole: formData.companyRole || "",
        jobDepartment: "",
        regionAllocated: "",
        faxNumber: formData.faxNumber || "",
        linkedinID: formData.linkedinID || "",
        twitterID: formData.twitterID || "",
        facebookID: formData.facebookID || "",
        instagramID: formData.instagramID || "",
        middleName: formData.middleName || "",
        mapLink: "",
        divisionalGroup: "",
        division: "",
        subdivision: "",
        sector: "",
        alternatePhone: formData.alternatePhone || ""
      };

      console.log('Request Body:', requestBody);

      const response = await fetch(`/api/AccountManager/WAVInternalUser/${userData.id}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error(errorData.message || 'Failed to update profile');
      }

      // Update local storage with new onboarded status
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        onboarderStatus: true
      }));

      setMessage({ text: "Profile updated successfully!", type: 'success' });

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Update error:', error);
      setMessage({
        text: error instanceof Error ? error.message : 'Failed to update profile',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative h-screen flex lg:grid lg:max-w-none lg:grid-cols-[60%_40%] lg:px-0">
      {/* Left side - Static image */}
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

      {/* Right side - Scrollable form */}
      <div className="relative flex flex-col h-screen overflow-y-auto">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px] p-8">
          <img src="/assets/da-logo.png" alt="DA LOGO" />

          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Complete Your Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Please provide your details to complete the registration
              {/* <span className="text-red-500 ml-1">*</span>
              <span className="text-sm"> indicates required field</span> */}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 w-full max-w-[450px]">
            {message && (
              <div className={`text-sm text-center p-2 rounded-md ${message.type === 'success'
                  ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
                  : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
                }`}>
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
                <Select onValueChange={(value) => handleSelectChange('companyRole', value)} value={formData.companyRole}>
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
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, '');
                    // Limit to 9 digits
                    if (value.length <= 9) {
                      handleInputChange({
                        target: {
                          id: 'zipCode',
                          value
                        }
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
                  onValueChange={(value) => handleSelectChange('gender', value)}
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