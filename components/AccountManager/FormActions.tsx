import React from "react";
import { Button } from "@/components/ui/button";
import { Save, X, Loader2 } from "lucide-react";

interface FormActionsProps {
    isSubmitting: boolean;
    onCancel: () => void;
    submitText?: string;
    cancelText?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
    isSubmitting,
    onCancel,
    submitText = "Create Account",
    cancelText = "Cancel",
}) => {
    return (
        <div className="flex justify-end gap-4 pt-4">
            <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex items-center gap-2"
                disabled={isSubmitting}
            >
                <X className="h-4 w-4" />
                {cancelText}
            </Button>
            <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                    </>
                ) : (
                    <>
                        <Save className="h-4 w-4" />
                        {submitText}
                    </>
                )}
            </Button>
        </div>
    );
};

export default FormActions;