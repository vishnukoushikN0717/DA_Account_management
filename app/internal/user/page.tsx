"use client";

import { useState } from "react";
import { InternalAccounts } from "@/components/internal/internal-accounts";
import { ExternalAccounts } from "@/components/internal/external-accounts";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";



export default function AccountPage() {
  const [isInternal, setIsInternal] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {/* <span className="text-blue-600 font-medium">Dashboard</span>
            <span>/</span> */}
            <span className="text-blue-600 font-medium" >Account Management</span>


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
            onCheckedChange={(checked) => setIsInternal(!checked)}
            className="data-[state=unchecked]:bg-blue-600 data-[state=checked]:bg-blue-600 "
          />
          <Label htmlFor="account-type" className={`text-sm ${isInternal ? ' text-muted-foreground' : ''}`}>
            External
          </Label>
        </div>
      </div>

      {isInternal ? <InternalAccounts /> : <ExternalAccounts />}


    </div>

  );
}