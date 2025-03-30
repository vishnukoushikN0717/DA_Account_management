"use client";

import React from 'react';
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
          <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Created Successfully
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-gray-700 dark:text-gray-300">
            Do you need to proceed with mapping?
          </Dialog.Description>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} className="text-gray-700 dark:text-gray-300">
              Close
            </Button>
            {children}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal; 