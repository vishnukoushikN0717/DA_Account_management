import React, { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface CompanyInformationProps {
    form: UseFormReturn<any>;
    requiredFields?: string[];
}

interface Company {
    id: string;
    name: string;
    entityNpiNumber?: string;
    entitySubtype?: string;
    email?: string;
}

// Helper component for required fields
const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="flex items-center gap-1">
        {children}
        <span className="text-red-500">*</span>
    </span>
);

const CompanyInformation: React.FC<CompanyInformationProps> = ({
    form,
    requiredFields = [],
}) => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

    const isRequired = (field: string) => requiredFields.includes(field);
    const companyType = form.watch("companyType");

    useEffect(() => {
        if (companyType) {
            fetchCompanies(companyType);
        }
    }, [companyType]);

    const fetchCompanies = async (type: string) => {
        setIsLoadingCompanies(true);
        try {
            let endpoint = "";
            switch (type) {
                case "Corporate":
                    endpoint = "CORPORATE";
                    break;
                case "Practice":
                    endpoint = "PRACTICE";
                    break;
                case "Ancillary":
                    endpoint = "ANCILLIARY";
                    break;
                case "EHR":
                    endpoint = "EHR";
                    break;
                case "Insurance":
                    endpoint = "INSURANCE";
                    break;
            }

            // Use the new rewrite route from next.config.js
            const response = await fetch(
                `/api/Entity/active?EntityType=${endpoint}`,
                {
                    method: "GET",
                    headers: {
                        accept: "*/*",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch companies");
            }

            const data = await response.json();
            setCompanies(data);
        } catch (error) {
            console.error("Error fetching companies:", error);
            toast.error("Failed to load companies");
            setCompanies([]);
        } finally {
            setIsLoadingCompanies(false);
        }
    };

    const renderCompanyOption = (company: Company) => {
        switch (companyType) {
            case "Practice":
                return (
                    <div>
                        <div>{company.name}</div>
                        <div className="text-sm text-muted-foreground">
                            NPI: {company.entityNpiNumber} | {company.entitySubtype}
                        </div>
                    </div>
                );
            case "Ancillary":
                return (
                    <div>
                        <div>{company.name}</div>
                        <div className="text-sm text-muted-foreground">
                            NPI: {company.entityNpiNumber} | {company.entitySubtype}
                        </div>
                    </div>
                );
            case "Corporate":
            case "EHR":
            case "Insurance":
                return (
                    <div>
                        <div>{company.name}</div>
                        <div className="text-sm text-muted-foreground">
                            {company.email} | {company.entitySubtype}
                        </div>
                    </div>
                );
            default:
                return <div>{company.name}</div>;
        }
    };

    return (
        <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
                <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                        Company Information
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="companyType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-gray-500" />
                                    {isRequired("companyType") ? (
                                        <RequiredLabel>Company Type</RequiredLabel>
                                    ) : (
                                        "Company Type"
                                    )}
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select company type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Corporate">Corporate</SelectItem>
                                        <SelectItem value="Practice">Practice</SelectItem>
                                        <SelectItem value="Ancillary">Ancillary</SelectItem>
                                        <SelectItem value="Insurance">Insurance</SelectItem>
                                        <SelectItem value="EHR">EHR</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="companyId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-gray-500" />
                                    {isRequired("companyId") ? (
                                        <RequiredLabel>Select Company</RequiredLabel>
                                    ) : (
                                        "Select Company"
                                    )}
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={!companyType || isLoadingCompanies}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    isLoadingCompanies
                                                        ? "Loading companies..."
                                                        : "Select a company"
                                                }
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {companies.map((company) => (
                                            <SelectItem key={company.id} value={company.id}>
                                                {renderCompanyOption(company)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default CompanyInformation;