"use client";

import { useState, useEffect } from "react";
import { InternalAccounts } from "@/components/internal/internal-accounts";
import { ExternalAccounts } from "@/components/internal/external-accounts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import ExternalLayout from "../../InternalLayout"; // Adjust the path as necessary

export default function AccountPage() {
  const [isInternal, setIsInternal] = useState(true);

  // Load the saved preference from localStorage when the component mounts
  useEffect(() => {
    // Get the saved preference
    const savedPreference = localStorage.getItem("accountTabPreference");

    // If a preference exists, use it
    if (savedPreference !== null) {
      setIsInternal(savedPreference === "internal");
    }
  }, []);

  // Save the preference whenever it changes
  const handleTabChange = (checked: boolean) => {
    const newValue = !checked;
    setIsInternal(newValue);
    localStorage.setItem("accountTabPreference", newValue ? "internal" : "external");
  };

  return (
    <ExternalLayout>
      {/* Added overflow-hidden to prevent unwanted scrolling */}
      <div className="space-y-4 overflow-hidden w-full">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {/* <span className="text-blue-600 font-medium">Dashboard</span>
            <span>/</span> */}
              <span className="text-blue-600 text-2xl font-medium">Account Management</span>

            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage {isInternal ? "internal" : "external"} accounts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="account-type" className={`text-sm ${!isInternal ? 'text-muted-foreground' : ''}`}>
              Internal
            </Label>
            <Switch
              id="account-type"
              checked={!isInternal}
              onCheckedChange={handleTabChange}
              className="data-[state=unchecked]:bg-blue-600 data-[state=checked]:bg-blue-600 "
            />
            <Label htmlFor="account-type" className={`text-sm ${isInternal ? ' text-muted-foreground' : ''}`}>
              External
            </Label>
          </div>
        </div>

        {/* Added account-content div with max-width to contain the table properly */}
        <div className="account-content w-full max-w-full">
          {isInternal ? <InternalAccounts /> : <ExternalAccounts />}
        </div>
      </div>
    </ExternalLayout>
  );
}