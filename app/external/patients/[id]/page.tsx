"use client";

import React from 'react';
import PatientEpisodes from "../../../../components/medical_dashborad"; // Adjust path as needed
import DashboardLayout from "../../ExternalLayout"; // Adjust path as needed
import { useParams } from 'next/navigation'; // Import from next/navigation

export default function PatientPage() {
  const params = useParams(); // Get dynamic route parameters
  const id = params?.id as string; // Extract id from params

  return (
    <DashboardLayout>
      <div>
        <PatientEpisodes id={id} /> {/* Pass id as a prop */}
      </div>
    </DashboardLayout>
  );
}