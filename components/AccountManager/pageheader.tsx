import React from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface PageHeaderProps {
    title: string;
    onBackToAccounts: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, onBackToAccounts }) => {
    return (
        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
                <span className="text-blue-600 dark:text-blue-400 font-medium">Dashboard</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{title}</span>
            </div>
            <Button
                variant="outline"
                onClick={onBackToAccounts}
                className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
            >
                <Users className="h-4 w-4" />
                Go to Accounts
            </Button>
        </div>
    );
};

export default PageHeader;