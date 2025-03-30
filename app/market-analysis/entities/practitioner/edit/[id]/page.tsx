"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Loader2,
  ArrowLeft,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { states } from "@/lib/location-data";

// Phone number regex that accepts both US and Indian formats
const phoneRegex = /^(\+?1[\s-]?)?(\([0-9]{3}\)|[0-9]{3})[\s-]?[0-9]{3}[\s-]?[0-9]{4}$|^(\+91[\s-]?)?[6789]\d{9}$/;

// URL regex for validating links
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

// NPI number regex (10 digits)
const npiRegex = /^\d{10}$/;

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  individualNpi: z.string().regex(npiRegex, "NPI number must be exactly 10 digits"),
  jobTitle: z.string().min(1, "Job title is required"),
  practitionerType: z.string().min(1, "Practitioner type is required"),
  personaType: z.string().min(1, "Persona type is required"),
  practitionerLifecycleStage: z.string().min(1, "Lifecycle stage is required"),
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
  noOfPendingOrders: z.string().optional(),
  noOfTotalPatients: z.string().optional(),
  noOfPracticesAssociated: z.string().optional(),
});

export default function EditPractitioner() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State for card expansion
  const [isBasicInfoExpanded, setBasicInfoExpanded] = useState(true);
  const [isLocationExpanded, setLocationExpanded] = useState(false);
  const [isOrgStructureExpanded, setOrgStructureExpanded] = useState(false);
  const [isContactInfoExpanded, setContactInfoExpanded] = useState(false);
  const [isSocialMediaExpanded, setSocialMediaExpanded] = useState(false);
  const [isMetricsExpanded, setMetricsExpanded] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      individualNpi: "",
      jobTitle: "",
      practitionerType: "",
      personaType: "",
      practitionerLifecycleStage: "",
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
      noOfPendingOrders: "",
      noOfTotalPatients: "",
      noOfPracticesAssociated: "",
    },
  });

  useEffect(() => {
    const fetchPractitioner = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/Practitioner/${params.id}`, {
          method: "GET",
          headers: {
            accept: "*/*",
          },
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch practitioner data");
        }

        const data = await response.json();
        
        // Map the API response to our form fields
        form.reset({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          individualNpi: data.individualNpi || "",
          jobTitle: data.jobTitle || "",
          practitionerType: data.practitionerType || "",
          personaType: data.personaType || "",
          practitionerLifecycleStage: data.practitionerLifecycleStage || "",
          state: data.state || "",
          city: data.city || "",
          county: data.county || "",
          zipcode: data.zipcode?.toString() || "",
          streetAddress: data.streetAddress || "",
          mapLink: data.mapLink || "",
          divisionalGroup: data.divisionalGroup || "",
          division: data.division || "",
          subdivision: data.subdivision || "",
          sector: data.sector || "",
          email: data.email || "",
          phoneNo: data.phoneNo || "",
          alternatePhone: data.alternatePhone || "",
          website: data.website || "",
          faxNo: data.faxNo || "",
          linkedinId: data.linkedInId || "",
          facebookId: data.facebookId || "",
          instagramId: data.instagramId || "",
          twitterId: data.twitterId || "",
          doximityId: data.doximityId || "",
          noOfPendingOrders: data.noOfPendingOrders?.toString() || "",
          noOfTotalPatients: data.noOfTotalPatients?.toString() || "",
          noOfPracticesAssociated: data.noOfPracticesAssociated?.toString() || "",
        });
      } catch (error) {
        console.error("Error fetching practitioner data:", error);
        toast.error("Failed to load practitioner data");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPractitioner();
    }
  }, [params.id, form]);

  // Toggle functions for collapsible sections
  const toggleBasicInfo = () => setBasicInfoExpanded(!isBasicInfoExpanded);
  const toggleLocation = () => setLocationExpanded(!isLocationExpanded);
  const toggleOrgStructure = () => setOrgStructureExpanded(!isOrgStructureExpanded);
  const toggleContactInfo = () => setContactInfoExpanded(!isContactInfoExpanded);
  const toggleSocialMedia = () => setSocialMediaExpanded(!isSocialMediaExpanded);
  const toggleMetrics = () => setMetricsExpanded(!isMetricsExpanded);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSaving(true);
      
      // Get logged in user email
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const loggedInUserEmail = userData.email || "unknown@example.com";
  
      const apiPayload = {
        id: params.id,
        firstName: values.firstName,
        lastName: values.lastName,
        individualNpi: values.individualNpi,
        jobTitle: values.jobTitle,
        practitionerType: values.practitionerType,
        personaType: values.personaType,
        practitionerLifecycleStage: values.practitionerLifecycleStage,
        state: values.state || "",
        city: values.city || "",
        county: values.county || "",
        zipcode: values.zipcode || "",
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
        noOfPendingOrders: values.noOfPendingOrders ? parseInt(values.noOfPendingOrders) : 0,
        noOfTotalPatients: values.noOfTotalPatients ? parseInt(values.noOfTotalPatients) : 0,
        noOfPracticesAssociated: values.noOfPracticesAssociated ? parseInt(values.noOfPracticesAssociated) : 0,
      };

      const response = await fetch(`/api/Practitioner/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update",
          ...apiPayload
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update practitioner");
      }

      toast.success("Practitioner updated successfully");
      router.push(`/market-analysis/entities/practitioner/profile/${params.id}`);
    } catch (error) {
      console.error("Error updating practitioner:", error);
      toast.error("Failed to update practitioner");
    } finally {
      setIsSaving(false);
    }
  }

  const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="flex items-center gap-1">
      {children}
      <span className="text-red-500">*</span>
    </span>
  );

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2">Loading practitioner details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-900 text-xl dark:text-gray-100 font-medium">
            Edit Practitioner
          </span>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/market-analysis/entities/practitioner/profile/${params.id}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Button>
      </div>

      <div className="max-w-[1200px] mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card className="shadow-md overflow-hidden rounded-xl">
              <div
                className="bg-gray-100 dark:bg-gray-800/50 py-3 px-4 cursor-pointer"
                onClick={toggleBasicInfo}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Basic Information
                  </h3>
                  <span>{isBasicInfoExpanded ? "-" : "+"}</span>
                </div>
              </div>
              {isBasicInfoExpanded && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>First Name</RequiredLabel>
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
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Last Name</RequiredLabel>
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
                      name="individualNpi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Individual NPI</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="10-digit NPI number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Job Title</RequiredLabel>
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
                      name="practitionerType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Practitioner Type</RequiredLabel>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select practitioner type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Physician">Physician</SelectItem>
                              <SelectItem value="NPP">NPP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personaType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Persona Type</RequiredLabel>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select persona type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Influencer">Influencer</SelectItem>
                              <SelectItem value="Decision Maker">Decision Maker</SelectItem>
                              <SelectItem value="Neutral">Neutral</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="practitionerLifecycleStage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>Lifecycle Stage</RequiredLabel>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select lifecycle stage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Not Using">Not Using</SelectItem>
                              <SelectItem value="Targeted">Targeted</SelectItem>
                              <SelectItem value="Active">Active</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Location Information */}
            <Card className="shadow-md overflow-hidden rounded-xl">
              <div
                className="bg-gray-100 dark:bg-gray-800/50 py-3 px-4 cursor-pointer"
                onClick={toggleLocation}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Location Information
                  </h3>
                  <span>{isLocationExpanded ? "-" : "+"}</span>
                </div>
              </div>
              {isLocationExpanded && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
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
                          <FormLabel>City</FormLabel>
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
                          <FormLabel>County</FormLabel>
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
                          <FormLabel>Zipcode</FormLabel>
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
                          <FormLabel>Street Address</FormLabel>
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
                          <FormLabel>Map Link</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Organization Structure */}
            <Card className="shadow-md overflow-hidden rounded-xl">
              <div
                className="bg-gray-100 dark:bg-gray-800/50 py-3 px-4 cursor-pointer"
                onClick={toggleOrgStructure}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Organization Structure
                  </h3>
                  <span>{isOrgStructureExpanded ? "-" : "+"}</span>
                </div>
              </div>
              {isOrgStructureExpanded && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="divisionalGroup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Divisional Group</FormLabel>
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
                          <FormLabel>Division</FormLabel>
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
                          <FormLabel>Subdivision</FormLabel>
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
                          <FormLabel>Sector</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Contact Information */}
            <Card className="shadow-md overflow-hidden rounded-xl">
              <div
                className="bg-gray-100 dark:bg-gray-800/50 py-3 px-4 cursor-pointer"
                onClick={toggleContactInfo}
              >
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Contact Information
                  </h3>
                  <span>{isContactInfoExpanded ? "-" : "+"}</span>
                </div>
              </div>
              {isContactInfoExpanded && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
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
                          <FormLabel>
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
                          <FormLabel>Alternate Phone</FormLabel>
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
                          <FormLabel>Website</FormLabel>
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
                          <FormLabel>Fax Number</FormLabel>
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
                          <FormLabel>Doximity ID</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Social Media */}
            <Card className="shadow-md overflow-hidden rounded-xl">
              <div
                className="bg-gray-100 dark:bg-gray-800/50 py-3 px-4 cursor-pointer"
                onClick={toggleSocialMedia}
              >
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Social Media
                  </h3>
                  <span>{isSocialMediaExpanded ? "-" : "+"}</span>
                </div>
              </div>
              {isSocialMediaExpanded && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="linkedinId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn Profile URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://linkedin.com/in/username" />
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
                          <FormLabel>Facebook Profile URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://facebook.com/username" />
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
                          <FormLabel>Instagram Profile URL</FormLabel>
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
                          <FormLabel>Twitter Profile URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://twitter.com/username" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div> 
                </div>
              )}
            </Card>

            {/* Metrics */}
            <Card className="shadow-md overflow-hidden rounded-xl">
              <div
                className="bg-gray-100 dark:bg-gray-800/50 py-3 px-4 cursor-pointer"
                onClick={toggleMetrics}
              >
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Metrics
                  </h3>
                  <span>{isMetricsExpanded ? "-" : "+"}</span>
                </div>
              </div>
              {isMetricsExpanded && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="noOfPendingOrders"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Pending Orders</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="noOfTotalPatients"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Total Patients</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="noOfPracticesAssociated"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Associated Practices</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </Card>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/market-analysis/entities/practitioner/profile/${params.id}`)}
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
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}