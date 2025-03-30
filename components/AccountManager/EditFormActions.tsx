import React from "react";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface EditFormActionsProps {
    isLoading: boolean;
    onCancel: () => void;
}

const EditFormActions: React.FC<EditFormActionsProps> = ({
    isLoading,
    onCancel,
}) => {
    return (
        <div className="flex justify-end gap-4 pt-4">
            <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <X className="h-4 w-4" />
                Cancel
            </Button>
            <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-colors"
            >
                <Save className="h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
            </Button>
        </div>
    );
};

export default EditFormActions;