"use client";

import React from 'react';
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";

interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ isOpen, onClose, onProceed }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
          <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Account has been created successfully!
          </Dialog.Title>
          <div className="text-green-500 text-3xl mb-2">
            <CheckCircleIcon className="h-8 w-8" />
          </div>
          <p className="text-sm text-gray-600">
            Do you want to proceed with mapping?
          </p>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} className="text-gray-700 dark:text-gray-300">
              Close
            </Button>
            <Button onClick={onProceed} className="bg-blue-600 text-white hover:bg-blue-500">
              Yes
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default SuccessPopup;