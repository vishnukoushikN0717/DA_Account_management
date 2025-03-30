import React from "react";
import { User, Mail, BadgeCheck } from "lucide-react";
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

interface AccountInformationProps {
    form: UseFormReturn<any>;
    requiredFields?: string[];
    roleOptions: { value: string; label: string }[];
}

const AccountInformation: React.FC<AccountInformationProps> = ({
    form,
    requiredFields = ["email", "userRole"],
    roleOptions,
}) => {
    const isRequired = (field: string) => requiredFields.includes(field);

    return (
        <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                        Account Information
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} className="dark:bg-gray-800 dark:border-gray-700" />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="userRole"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <BadgeCheck className="h-4 w-4 text-gray-500" />
                                    User Role
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
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
                </div>
            </CardContent>
        </Card>
    );
};

export default AccountInformation;