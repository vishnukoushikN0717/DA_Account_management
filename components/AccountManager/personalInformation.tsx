import React, { useState, useRef } from "react";
import { User, UserCircle, Calendar, Mail, Upload, Image } from "lucide-react";
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
import { Button } from "@/components/ui/button";

interface PersonalInformationProps {
    form: UseFormReturn<any>;
    requiredFields?: string[];
}

// Helper component for required fields
const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="flex items-center gap-1">
        {children}
        <span className="text-red-500">*</span>
    </span>
);

const PersonalInformation: React.FC<PersonalInformationProps> = ({
    form,
    requiredFields = ["email"]
}) => {
    const isRequired = (field: string) => requiredFields.includes(field);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file selection
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);

        // Create a preview URL
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);

        // Store the file information in form data for later upload
        // We're not setting profileImageUrl yet, just storing the file for later
        form.setValue("_tempImageFile", file);
    };

    // Trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                        Personal Information
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Image Upload */}
                    <div className="md:col-span-3">
                        <FormField
                            control={form.control}
                            name="profileImageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        <Image className="h-4 w-4 text-gray-500" />
                                        Profile Image
                                    </FormLabel>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                        />
                                        <div className="flex gap-4 items-center">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={triggerFileInput}
                                                className="flex gap-2 items-center"
                                            >
                                                <Upload className="h-4 w-4" />
                                                {selectedFile ? "Change Image" : "Choose File"}
                                            </Button>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    readOnly
                                                    placeholder="No file chosen"
                                                    value={selectedFile ? selectedFile.name : ""}
                                                />
                                            </FormControl>
                                        </div>
                                        {previewUrl && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-500 mb-1">Preview:</p>
                                                <img
                                                    src={previewUrl}
                                                    alt="Profile preview"
                                                    className="w-24 h-24 object-cover rounded-md border border-gray-300"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <UserCircle className="h-4 w-4 text-gray-500" />
                                    {isRequired("firstName") ? (
                                        <RequiredLabel>First Name</RequiredLabel>
                                    ) : (
                                        "First Name"
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
                        name="middleName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <UserCircle className="h-4 w-4 text-gray-500" />
                                    Middle Name
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
                                    <UserCircle className="h-4 w-4 text-gray-500" />
                                    {isRequired("lastName") ? (
                                        <RequiredLabel>Last Name</RequiredLabel>
                                    ) : (
                                        "Last Name"
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    {isRequired("email") ? (
                                        <RequiredLabel>Email</RequiredLabel>
                                    ) : (
                                        "Email"
                                    )}
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
                        name="dob"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    Date of Birth
                                </FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    Gender
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
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

export default PersonalInformation;