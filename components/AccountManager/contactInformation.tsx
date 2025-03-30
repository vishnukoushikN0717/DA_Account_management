import React from "react";
import { Phone, PhoneCall, Fan as Fax } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";

interface ContactInformationProps {
    form: UseFormReturn<any>;
    requiredFields?: string[];
    phoneField?: string; // Different name in external vs internal
    faxField?: string; // Different name in external vs internal
}

// Helper component for required fields
const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="flex items-center gap-1">
        {children}
        <span className="text-red-500">*</span>
    </span>
);

const ContactInformation: React.FC<ContactInformationProps> = ({
    form,
    requiredFields = [],
    phoneField = "phone", // Default for external
    faxField = "faxNumber", // Default for external
}) => {
    const isRequired = (field: string) => requiredFields.includes(field);

    return (
        <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
                <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                        Contact Information
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name={phoneField}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <PhoneCall className="h-4 w-4 text-gray-500" />
                                    {isRequired(phoneField) ? (
                                        <RequiredLabel>Phone Number</RequiredLabel>
                                    ) : (
                                        "Phone Number"
                                    )}
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="" />
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
                                    {isRequired("alternatePhone") ? (
                                        <RequiredLabel>Alternate Phone</RequiredLabel>
                                    ) : (
                                        "Alternate Phone"
                                    )}
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={faxField}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Fax className="h-4 w-4 text-gray-500" />
                                    {isRequired(faxField) ? <RequiredLabel>Fax Number</RequiredLabel> : "Fax Number"}
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

export default ContactInformation;