"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  MapPin,
  Phone,
  Share2,
  Save,
  X,
  Mail,
  Globe,
  Users,
  DollarSign,
  Map,
  Building,
  Briefcase,
  Activity,
  LinkedinIcon,
  Facebook,
  Instagram,
  Twitter,
  Stethoscope,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { states } from "@/lib/location-data";
import { useState, useEffect } from "react";
import SuccessPopup from "@/components/ui/SuccessPopup";

// Phone number regex that accepts both US and Indian formats
const phoneRegex = /^(\+?1[\s-]?)?(\([0-9]{3}\)|[0-9]{3})[\s-]?[0-9]{3}[\s-]?[0-9]{4}$|^(\+91[\s-]?)?[6789]\d{9}$/;

// URL regex for validating links
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

// NPI number regex (10 digits)
const npiRegex = /^\d{10}$/;

const formSchema = z.object({
  name: z.string().min(2, "Ancillary name must be at least 2 characters"),
  entitySubtype: z.string().min(1, "Ancillary vertical is required"),
  entityNpiNumber: z.string().regex(npiRegex, "NPI number must be exactly 10 digits"),
  lifecycleStage: z.string().min(1, "Lifecycle stage is required"),
  services: z.string().min(1, "Services is required"),
  state: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  zipcode: z.string()
    .optional()
    .refine((val) => !val || /^[0-9]{5}(-[0-9]{4})?$/.test(val), {
      message: "Zipcode must be 5 or 9 digits (XXXXX or XXXXX-XXXX)"
    }),
  streetAddress: z.string().optional(),
  mapLink: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  divisionalGroup: z.string().optional(),
  division: z.string().optional(),
  subdivision: z.string().optional(),
  sector: z.string().optional(),
  email: z.string().email("Invalid email format"),
  phoneNo: z.string().regex(phoneRegex, "Invalid phone number format"),
  alternatePhone: z.string().regex(phoneRegex, "Invalid phone number format").optional().or(z.literal("")),
  website: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  faxNo: z.string().optional(),
  linkedinId: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  facebookId: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  instagramId: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  twitterId: z.string().regex(urlRegex, "Invalid URL format").optional().or(z.literal("")),
  doximityId: z.string().optional(),
  noOfEmployees: z.string().optional(),
  logo: z.string().optional(),
  locationImage: z.string().optional(),
  noOfPhysicians: z.string().optional(), // Note: Keeping field name same but label will be "Number of Care Providers"
  yearlyRevenue: z.string().optional(),
  medicalSpeciality: z.string().optional(),
  ehrUsed: z.string().optional(),
  insuranceAccepted: z.array(z.string()).optional(),
});

export default function CreateAncillary() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ancillaryId, setAncillaryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State for card expansion, closed by default
  const [isBasicInfoExpanded, setBasicInfoExpanded] = useState(false);
  const [isLocationExpanded, setLocationExpanded] = useState(false);
  const [isOrgStructureExpanded, setOrgStructureExpanded] = useState(false);
  const [isContactInfoExpanded, setContactInfoExpanded] = useState(false);
  const [isSocialMediaExpanded, setSocialMediaExpanded] = useState(false);
  const [isCompanyDetailsExpanded, setCompanyDetailsExpanded] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      entitySubtype: "",
      entityNpiNumber: "",
      lifecycleStage: "",
      services: "",
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
      email: "",
      phoneNo: "",
      alternatePhone: "",
      website: "",
      faxNo: "",
      linkedinId: "",
      facebookId: "",
      instagramId: "",
      twitterId: "",
      doximityId: "",
      noOfEmployees: "",
      logo: "",
      locationImage: "",
      noOfPhysicians: "",
      yearlyRevenue: "",
      medicalSpeciality: "",
      ehrUsed: "",
      insuranceAccepted: [],
    },
  });

  // Toggle functions for collapsible sections
  const toggleBasicInfo = () => setBasicInfoExpanded(!isBasicInfoExpanded);
  const toggleLocation = () => setLocationExpanded(!isLocationExpanded);
  const toggleOrgStructure = () => setOrgStructureExpanded(!isOrgStructureExpanded);
  const toggleContactInfo = () => setContactInfoExpanded(!isContactInfoExpanded);
  const toggleSocialMedia = () => setSocialMediaExpanded(!isSocialMediaExpanded);
  const toggleCompanyDetails = () => setCompanyDetailsExpanded(!isCompanyDetailsExpanded);

  useEffect(() => {
    // Simulate form initialization loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const errors = form.formState.errors;

    if (Object.keys(errors).length > 0) {
      if (errors.name || errors.entitySubtype || errors.entityNpiNumber || errors.lifecycleStage || 
          errors.services) {
        setBasicInfoExpanded(true);
      }
      if (errors.email || errors.phoneNo) {
        setContactInfoExpanded(true);
      }
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSaving(true);
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const loggedInUserEmail = userData.email || "unknown@example.com";

      const apiPayload = {
        name: values.name,
        loggedInUser: loggedInUserEmail,
        entityType: "ANCILLIARY",
        entitySubtype: values.entitySubtype,
        lifecycleStage: values.lifecycleStage,
        entityNpiNumber: values.entityNpiNumber,
        services: values.services,
        addressType: "PRIMARY",
        state: values.state || "",
        city: values.city || "",
        county: values.county || "",
        zipcode: values.zipcode ? parseInt(values.zipcode.replace("-", "")) : 0,
        streetAddress: values.streetAddress || "",
        mapLink: values.mapLink || "",
        divisionalGroup: values.divisionalGroup || "",
        division: values.division || "",
        subdivision: values.subdivision || "",
        sector: values.sector || "",
        email: values.email,
        phoneNo: values.phoneNo,
        alternatePhone: values.alternatePhone || "",
        website: values.website || "",
        faxNo: values.faxNo || "",
        linkedInId: values.linkedinId || "",
        facebookId: values.facebookId || "",
        instagramId: values.instagramId || "",
        twitterId: values.twitterId || "",
        doximityId: values.doximityId || "",
        medicalSpeciality: values.medicalSpeciality || "",
        insuranceAccepted: values.insuranceAccepted || [],
        logo: values.logo || "",
        locationImage: values.locationImage || "",
        noOfPatients: 0,
        noOfActivePatients: 0,
        noOfActivePatientsHHAH: "",
        noOfPhysicians: values.noOfPhysicians ? parseInt(values.noOfPhysicians) : 0,
        noOfEmployees: values.noOfEmployees ? parseInt(values.noOfEmployees) : 0,
        yearlyRevenue: values.yearlyRevenue || "",
        ehrUsed: values.ehrUsed || "",
        parentCorporate: null,
        e_AssociatedEntities: [],
      };

      const response = await fetch("/api/EntityData/Entity", {
        method: "POST",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create ancillary");
      }

      const createdAncillary = await response.json();
      const newAncillaryId = createdAncillary.result.id;
      setAncillaryId(newAncillaryId);
      setShowSuccessModal(true);
      toast.success("Ancillary created successfully");
    } catch (error) {
      const errorMessage = (error as Error).message || "Failed to create ancillary";
      console.error("Error creating ancillary:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  }

  const handleProceedMapping = () => {
    if (ancillaryId) {
      router.push(`/market-analysis/entities/ancillaries/mapp?id=${ancillaryId}`);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessModal(false);
    router.push("/market-analysis/entities/ancillaries/landing");
  };

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="flex items-center gap-1">
      {children}
      <span className="text-red-500">*</span>
    </span>
  );

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <h2 className="mt-4 text-lg font-semibold">Loading...</h2>
        <p className="text-sm text-gray-500">Please wait while we set up the form</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="border-b pb-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span className="text-blue-600 font-medium">Dashboard</span>
          <span>/</span>
          <span>Create Ancillary</span>
        </div>
        <div className="mt-2">
          <h1 className="text-2xl font-semibold">Create Ancillary</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details below to create a new ancillary entity
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto">
        <Form {...form}>
          <form id="create-ancillary-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card className="shadow-md overflow-hidden rounded-xl">
              <CardHeader
                className="bg-gray-100 dark:bg-gray-800/50 py-3 cursor-pointer"
                onClick={toggleBasicInfo}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Basic Information
                  </CardTitle>
                  <span>{isBasicInfoExpanded ? "-" : "+"}</span>
                </div>
              </CardHeader>
              {isBasicInfoExpanded && (
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <RequiredLabel>Ancillary Name</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="entitySubtype"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-gray-500" />
                            <RequiredLabel>Ancillary Vertical</RequiredLabel>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select ancillary vertical" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Home Health Agency">Home Health Agency</SelectItem>
                              <SelectItem value="Hospice">Hospice</SelectItem>
                              <SelectItem value="Physiotherapy Groups">Physiotherapy Groups</SelectItem>
                              <SelectItem value="Occupational Therapists">Occupational Therapists</SelectItem>
                              <SelectItem value="Sleep Study">Sleep Study</SelectItem>
                              <SelectItem value="Speech Services">Speech Services</SelectItem>
                              <SelectItem value="Wound-care Groups">Wound-care Groups</SelectItem>
                              <SelectItem value="Audiology services Groups">Audiology Services Groups</SelectItem>
                              <SelectItem value="Behavioural Health Service Groups">Behavioural Health Service Groups</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="entityNpiNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-gray-500" />
                            <RequiredLabel>Ancillary NPI Number</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="10-digit NPI" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lifecycleStage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-gray-500" />
                            <RequiredLabel>Lifecycle Stage</RequiredLabel>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select lifecycle stage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Not Using">Not Using</SelectItem>
                              <SelectItem value="Common Patients">Common Patients</SelectItem>
                              <SelectItem value="Freemium">Freemium</SelectItem>
                              <SelectItem value="99 Cents">99 Cents</SelectItem>
                              <SelectItem value="Full Subscription">Full Subscription</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="services"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-gray-500" />
                            <RequiredLabel>Services</RequiredLabel>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select services" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Document preparation">Document Preparation</SelectItem>
                              <SelectItem value="efaxes">Efaxes</SelectItem>
                              <SelectItem value="Billing Reports">Billing Reports</SelectItem>
                              <SelectItem value="Claims">Claims</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Location Information */}
            <Card className="shadow-md overflow-hidden rounded-xl">
              <CardHeader
                className="bg-gray-100 dark:bg-gray-800/50 py-3 cursor-pointer"
                onClick={toggleLocation}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Location Information
                  </CardTitle>
                  <span>{isLocationExpanded ? "-" : "+"}</span>
                </div>
              </CardHeader>
              {isLocationExpanded && (
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            State
                          </FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {states.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            City
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="county"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            County
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            Zipcode
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="XXXXX or XXXXX-XXXX" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="streetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            Street Address
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mapLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Map className="h-4 w-4 text-gray-500" />
                            Map Link
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Organization Structure */}
            <Card className="shadow-md overflow-hidden rounded-xl">
              <CardHeader
                className="bg-gray-100 dark:bg-gray-800/50 py-3 cursor-pointer"
                onClick={toggleOrgStructure}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Organization Structure
                  </CardTitle>
                  <span>{isOrgStructureExpanded ? "-" : "+"}</span>
                </div>
              </CardHeader>
              {isOrgStructureExpanded && (
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="divisionalGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            Divisional Group
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="division"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            Division
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subdivision"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            Subdivision
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sector"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            Sector
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Contact Information */}
            <Card className="shadow-md overflow-hidden rounded-xl">
              <CardHeader
                className="bg-gray-100 dark:bg-gray-800/50 py-3 cursor-pointer"
                onClick={toggleContactInfo}
              >
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Contact Information
                  </CardTitle>
                  <span>{isContactInfoExpanded ? "-" : "+"}</span>
                </div>
              </CardHeader>
              {isContactInfoExpanded && (
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <RequiredLabel>Email</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <RequiredLabel>Phone Number</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="alternatePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            Alternate Phone
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-500" />
                            Website
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="faxNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            Fax Number
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="doximityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            Doximity ID
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Social Media */}
            <Card className="shadow-md overflow-hidden rounded-xl">
              <CardHeader
                className="bg-gray-100 dark:bg-gray-800/50 py-3 cursor-pointer"
                onClick={toggleSocialMedia}
              >
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Social Media
                  </CardTitle>
                  <span>{isSocialMediaExpanded ? "-" : "+"}</span>
                </div>
              </CardHeader>
              {isSocialMediaExpanded && (
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="linkedinId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <LinkedinIcon className="h-4 w-4 text-gray-500" />
                            LinkedIn Profile URL
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://linkedin.com/company/name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="facebookId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Facebook className="h-4 w-4 text-gray-500" />
                            Facebook Profile URL
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://facebook.com/pagename" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="instagramId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Instagram className="h-4 w-4 text-gray-500" />
                            Instagram Profile URL
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://instagram.com/username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="twitterId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Twitter className="h-4 w-4 text-gray-500" />
                            Twitter Profile URL
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://twitter.com/username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Company Details */}
            <Card className="shadow-md overflow-hidden rounded-xl">
              <CardHeader
                className="bg-gray-100 dark:bg-gray-800/50 py-3 cursor-pointer"
                onClick={toggleCompanyDetails}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Company Details
                  </CardTitle>
                  <span>{isCompanyDetailsExpanded ? "-" : "+"}</span>
                </div>
              </CardHeader>
              {isCompanyDetailsExpanded && (
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="noOfEmployees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            Number of Employees
                          </FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="noOfPhysicians"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-gray-500" />
                            Number of Care Providers
                          </FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="yearlyRevenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            Yearly Revenue
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="$" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="medicalSpeciality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-gray-500" />
                            Medical Speciality
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ehrUsed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            EHR Used
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="insuranceAccepted"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            Insurance Accepted
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              const currentValues = field.value || [];
                              const newValues = currentValues.includes(value)
                                ? currentValues.filter((v) => v !== value)
                                : [...currentValues, value];
                              field.onChange(newValues);
                            }}
                            value=""
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select insurance" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Aviva">Aviva</SelectItem>
                              <SelectItem value="LIC">LIC</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="mt-2">
                            {field.value?.map((insurance) => (
                              <span
                                key={insurance}
                                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                              >
                                {insurance}
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange(field.value?.filter((v) => v !== insurance));
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/market-analysis/entities/ancillaries/landing")}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Ancillary
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <SuccessPopup
        isOpen={showSuccessModal}
        onClose={handleClosePopup}
        onProceed={handleProceedMapping}
      />
    </div>
  );
}