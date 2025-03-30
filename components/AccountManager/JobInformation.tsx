import React from "react";
import { Briefcase, BadgeCheck, Building2, LinkIcon } from "lucide-react";
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

interface JobInformationProps {
    form: UseFormReturn<any>;
    requiredFields?: string[];
    roleOptions: { value: string; label: string }[];
    showWavExternalId?: boolean;
    showJobDepartment?: boolean;
}

// Helper component for required fields
const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="flex items-center gap-1">
        {children}
        <span className="text-red-500">*</span>
    </span>
);

const JobInformation: React.FC<JobInformationProps> = ({
    form,
    requiredFields = ["userRole"],
    roleOptions,
    showWavExternalId = false,
    showJobDepartment = false,
}) => {
    const isRequired = (field: string) => requiredFields.includes(field);

    return (
        <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
                <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                        Job Information
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="userRole"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <BadgeCheck className="h-4 w-4 text-gray-500" />
                                    {isRequired("userRole") ? (
                                        <RequiredLabel>User Type</RequiredLabel>
                                    ) : (
                                        "User Type"
                                    )}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {roleOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
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
                        name="jobRole"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-gray-500" />
                                    {isRequired("jobRole") ? <RequiredLabel>Job Title</RequiredLabel> : "Job Title"}
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {showWavExternalId && (
                        <FormField
                            control={form.control}
                            name="wavExternalUserId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <LinkIcon className="h-4 w-4 text-gray-500" />
                                        Associated WAV ID
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {showJobDepartment && (
                        <FormField
                            control={form.control}
                            name="jobDepartment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-gray-500" />
                                        Job Department
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default JobInformation;