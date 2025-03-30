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
  ImageIcon,
  Map,
  Building,
  Briefcase,
  Activity,
  LinkedinIcon,
  Facebook,
  Instagram,
  Twitter,
  CheckCircleIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { states } from "@/lib/location-data";
import { useState, useEffect } from "react";
// import Modal from "@/components/ui/modal";
import SuccessPopup from "@/components/ui/SuccessPopup";
// D:\entity_create_mapp\Wav-UI\components\ui\SuccessPopup.tsx

// Phone number regex that accepts both US and Indian formats
const phoneRegex =
  /^(\+?1[\s-]?)?(\([0-9]{3}\)|[0-9]{3})[\s-]?[0-9]{3}[\s-]?[0-9]{4}$|^(\+91[\s-]?)?[6789]\d{9}$/;

// URL regex for validating links
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  jobTitle: z.string().min(1, "Job title is required"),
  lifecycleStage: z.string().min(1, "Lifecycle stage is required"),
  personaType: z.string().optional(),
  divisionalGroup: z.string().optional(),
  division: z.string().optional(),
  subdivision: z.string().optional(),
  sector: z.string().optional(),
  faxNo: z.string().optional(),
  doximityId: z.string().optional(),
  linkedinId: z.string().optional(),
  facebookId: z.string().optional(),
  instagramId: z.string().optional(),
  twitterId: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  zipcode: z.string()
    .regex(/^\d{5}(-\d{4})?$/, "Zip code must be in 5 or 9 digit format")
    .optional(),
  streetAddress: z.string().optional(),
  mapLink: z
    .string()
    .regex(urlRegex, "Invalid URL format")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email format"),
  phoneNo: z
    .string()
    .length(10, "Phone number must be 10 digits")
    .regex(/^\d{10}$/, "Phone number must be numeric"),
  alternatePhone: z.string().optional().or(z.literal("")),
  website: z
    .string()
    .regex(urlRegex, "Invalid URL format")
    .optional()
    .or(z.literal("")),
  countryCode: z.string().min(1, "Country code is required"),
});

export default function CreateContact() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [contactId, setContactId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State for card expansion
  const [isBasicInfoExpanded, setBasicInfoExpanded] = useState(true);
  const [isContactInfoExpanded, setContactInfoExpanded] = useState(true);
  const [isSocialMediaExpanded, setSocialMediaExpanded] = useState(true);
  const [isLocationExpanded, setLocationExpanded] = useState(true);
  const [isOrganizationStructureExpanded, setOrganizationStructureExpanded] =
    useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      jobTitle: "",
      lifecycleStage: "",
      personaType: "",
      divisionalGroup: "",
      division: "",
      subdivision: "",
      sector: "",
      faxNo: "",
      doximityId: "",
      linkedinId: "",
      facebookId: "",
      instagramId: "",
      twitterId: "",
      state: "",
      city: "",
      county: "",
      zipcode: "",
      streetAddress: "",
      mapLink: "",
      email: "",
      phoneNo: "",
      alternatePhone: "",
      website: "",
      countryCode: "",
    },
  });

  // Log form errors on every render
  const {
    formState: { errors },
  } = form;
  console.log("Form errors:", errors);

  // Toggle functions
  const toggleBasicInfo = () => setBasicInfoExpanded(!isBasicInfoExpanded);
  const toggleContactInfo = () =>
    setContactInfoExpanded(!isContactInfoExpanded);
  const toggleSocialMedia = () =>
    setSocialMediaExpanded(!isSocialMediaExpanded);
  const toggleLocation = () => setLocationExpanded(!isLocationExpanded);
  const toggleOrganizationStructure = () =>
    setOrganizationStructureExpanded(!isOrganizationStructureExpanded);

  useEffect(() => {
    // Simulate form initialization loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    try {
      const response = await fetch("/api/Contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          jobTitle: values.jobTitle,
          personaType: values.personaType,
          contactLifecycleStage: values.lifecycleStage,
          state: values.state,
          city: values.city,
          county: values.county,
          zipcode: values.zipcode,
          streetAddress: values.streetAddress,
          mapLink: values.mapLink,
          email: values.email,
          phoneNo: values.phoneNo,
          alternatePhone: values.alternatePhone,
          website: values.website,
          faxNo: values.faxNo,
          linkedInID: values.linkedinId,
          facebookID: values.facebookId,
          instagramID: values.instagramId,
          twitterID: values.twitterId,
          doximityID: values.doximityId,
          contactOwner: "string",
          associatedEntities: [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create contact");
      }

      const createdContact = await response.json();
      const contactId = createdContact.id;
      setContactId(contactId);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Failed to create contact");
    } finally {
      setIsSaving(false);
    }
  }

  const handleProceedMapping = () => {
    if (contactId) {
        router.push(`/market-analysis/entities/contacts/mapp?id=${contactId}`);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessModal(false); // Close the popup
    router.push("/market-analysis/entities/contacts/landing"); // Navigate to /contacts/landing
  };

//   D:\entity_create_mapp\Wav-UI\app\market-analysis\entities\contacts\landing\page.tsx

//   const handleCancelMapping = () => {
//     router.push("/contacts/landing");
//   };

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
        
        <h1 className="text-2xl font-semibold mt-2">Create Contact</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details below to create a new contact entity
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
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
                          <FormLabel className="flex items-center gap-2">
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
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <RequiredLabel>Job Title</RequiredLabel>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select job title" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Admin staff">
                                Admin staff
                              </SelectItem>
                              <SelectItem value="Billing supervisor">
                                Billing supervisor
                              </SelectItem>
                              <SelectItem value="CXO">CXO</SelectItem>
                              <SelectItem value="Office Manager/Administrator">
                                Office Manager/Administrator
                              </SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
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
                            <RequiredLabel>Lifecycle Stage</RequiredLabel>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select lifecycle stage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Untouched">
                                Untouched
                              </SelectItem>
                              <SelectItem value="Targeted">Targeted</SelectItem>
                              <SelectItem value="Preliminary Interest">
                                Preliminary Interest
                              </SelectItem>
                              <SelectItem value="In Sale Cycle">
                                In Sale Cycle
                              </SelectItem>
                              <SelectItem value="Closed">Closed</SelectItem>
                              <SelectItem value="User">User</SelectItem>
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
                          <FormLabel className="flex items-center gap-2">
                            Persona Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select persona type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Influencer">
                                Influencer
                              </SelectItem>
                              <SelectItem value="Decision Maker">
                                Decision Maker
                              </SelectItem>
                              <SelectItem value="Neutral">Neutral</SelectItem>
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
                            <Input {...field} />
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
                onClick={toggleOrganizationStructure}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Organization Structure
                  </CardTitle>
                  <span>{isOrganizationStructureExpanded ? "-" : "+"}</span>
                </div>
              </CardHeader>
              {isOrganizationStructureExpanded && (
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
                      name="faxNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
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
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <RequiredLabel>Country Code</RequiredLabel>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="+1">USA (+1)</SelectItem>
                              <SelectItem value="+91">India (+91)</SelectItem>
                            </SelectContent>
                          </Select>
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
                            <Input
                              {...field}
                              placeholder="Enter 10-digit number"
                              maxLength={10}
                            />
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
                            <Input
                              {...field}
                              placeholder="https://linkedin.com/company/name"
                            />
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
                            <Input
                              {...field}
                              placeholder="https://facebook.com/pagename"
                            />
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
                            <Input
                              {...field}
                              placeholder="https://instagram.com/username"
                            />
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
                            <Input
                              {...field}
                              placeholder="https://twitter.com/username"
                            />
                          </FormControl>
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
                onClick={() => router.push("/market-analysis/entities/contacts/landing")}
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
                    Create Contact
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <SuccessPopup
        isOpen={showSuccessModal}
        // onClose={() => setShowSuccessModal(false)}
        onClose={handleClosePopup} // Updated to use handleClosePopup
        onProceed={handleProceedMapping}
      />
    </div>
  );
}
