import React from "react";
import { MapPin, Building, Map, Share2, Users, Building2 } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface LocationInformationProps {
    form: UseFormReturn<any>;
    requiredFields?: string[];
    states: string[];
    addressField?: string; // Different name in external vs internal
    zipcodeField?: string; // Different name in external vs internal
}

// Helper component for required fields
const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="flex items-center gap-1">
        {children}
        <span className="text-red-500">*</span>
    </span>
);

const LocationInformation: React.FC<LocationInformationProps> = ({
    form,
    requiredFields = [],
    states,
    addressField = "address", // Default for external
    zipcodeField = "zipCode", // Default for external
}) => {
    const isRequired = (field: string) => requiredFields.includes(field);

    return (
        <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
                <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                        Location Information
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="regionAllocated"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Map className="h-4 w-4 text-gray-500" />
                                    {isRequired("regionAllocated") ? (
                                        <RequiredLabel>Region Allocated</RequiredLabel>
                                    ) : (
                                        "Region Allocated"
                                    )}
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
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    {isRequired("state") ? <RequiredLabel>State</RequiredLabel> : "State"}
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
                                    {isRequired("city") ? <RequiredLabel>City</RequiredLabel> : "City"}
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
                                    {isRequired("county") ? <RequiredLabel>County</RequiredLabel> : "County"}
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
                        name={zipcodeField}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    {isRequired(zipcodeField) ? <RequiredLabel>Zipcode</RequiredLabel> : "Zipcode"}
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
                        name={addressField}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    {isRequired(addressField) ? (
                                        <RequiredLabel>Street Address</RequiredLabel>
                                    ) : (
                                        "Street Address"
                                    )}
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
                                    <Share2 className="h-4 w-4 text-gray-500" />
                                    {isRequired("mapLink") ? <RequiredLabel>Map Link</RequiredLabel> : "Map Link"}
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
                        name="divisionalGroup"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-gray-500" />
                                    {isRequired("divisionalGroup") ? (
                                        <RequiredLabel>Divisional Group</RequiredLabel>
                                    ) : (
                                        "Divisional Group"
                                    )}
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
                                    {isRequired("division") ? <RequiredLabel>Division</RequiredLabel> : "Division"}
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
                                    {isRequired("subdivision") ? (
                                        <RequiredLabel>Subdivision</RequiredLabel>
                                    ) : (
                                        "Subdivision"
                                    )}
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
                                    {isRequired("sector") ? <RequiredLabel>Sector</RequiredLabel> : "Sector"}
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
        </Card>
    );
};

export default LocationInformation;