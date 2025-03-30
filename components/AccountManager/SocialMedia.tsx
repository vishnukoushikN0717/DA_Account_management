import React from "react";
import { Share2, Linkedin as LinkedinIcon, Facebook, Instagram, Twitter } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";

interface SocialMediaProps {
    form: UseFormReturn<any>;
    requiredFields?: string[];
    fieldNames?: {
        linkedin?: string;
        facebook?: string;
        instagram?: string;
        twitter?: string;
    };
}

// Helper component for required fields
const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="flex items-center gap-1">
        {children}
        <span className="text-red-500">*</span>
    </span>
);

const SocialMedia: React.FC<SocialMediaProps> = ({
    form,
    requiredFields = [],
    fieldNames = {
        linkedin: "linkedinID", // Default for external
        facebook: "facebookID", // Default for external
        instagram: "instagramID", // Default for external
        twitter: "twitterID", // Default for external
    },
}) => {
    const isRequired = (field: string) => requiredFields.includes(field);

    const { linkedin, facebook, instagram, twitter } = fieldNames;

    return (
        <Card className="border dark:border-gray-800">
            <CardHeader className="bg-gray-100 dark:bg-gray-800/50 py-3">
                <div className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <CardTitle className="text-base font-medium text-gray-700 dark:text-gray-200">
                        Social Media
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name={linkedin || "linkedinID"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <LinkedinIcon className="h-4 w-4 text-gray-500" />
                                    {isRequired(linkedin || "linkedinID") ? (
                                        <RequiredLabel>LinkedIn Profile URL</RequiredLabel>
                                    ) : (
                                        "LinkedIn Profile URL"
                                    )}
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="https://linkedin.com/in/username" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={facebook || "facebookID"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Facebook className="h-4 w-4 text-gray-500" />
                                    {isRequired(facebook || "facebookID") ? (
                                        <RequiredLabel>Facebook Profile URL</RequiredLabel>
                                    ) : (
                                        "Facebook Profile URL"
                                    )}
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="https://facebook.com/username" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={instagram || "instagramID"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Instagram className="h-4 w-4 text-gray-500" />
                                    {isRequired(instagram || "instagramID") ? (
                                        <RequiredLabel>Instagram Profile URL</RequiredLabel>
                                    ) : (
                                        "Instagram Profile URL"
                                    )}
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
                        name={twitter || "twitterID"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Twitter className="h-4 w-4 text-gray-500" />
                                    {isRequired(twitter || "twitterID") ? (
                                        <RequiredLabel>Twitter Profile URL</RequiredLabel>
                                    ) : (
                                        "Twitter Profile URL"
                                    )}
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
        </Card>
    );
};

export default SocialMedia;