"use client";
import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "../app/external/ExternalLayout"; // Adjust path as needed
import { useTheme } from "next-themes";

const UploadOrderContent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [orderDetails, setOrderDetails] = useState({
    orderType: "Verbal Order",
    episode: "",
    startOfCare: "",
    orderDate: "",
    isVerified: false,
    patientName: "",
    ancillary: "",
    practice: "",
    practitioner: "",
  });

  useEffect(() => {
    const soc = searchParams.get("soc") || "--";
    const soe = searchParams.get("soe") || "--";
    const eoe = searchParams.get("eoe") || "--";
    const episodeNo = searchParams.get("episodeNo") || "--";
    const patientId = searchParams.get("patientId");

    let cachedData = {
      patientFName: "--",
      patientMName: "",
      patientLName: "--",
      nameOfAgency: "--",
      physicianGroup: "--",
      billingProvider: "--",
      profilePic: null,
    };
    if (patientId) {
      const cached = localStorage.getItem(`patient_${patientId}`);
      if (cached) {
        cachedData = JSON.parse(cached);
      }
    }

    const episodeString = `Ep-${episodeNo} (${soe} to ${eoe})`;

    setOrderDetails({
      orderType: "Verbal Order",
      episode: episodeString,
      startOfCare: soc,
      orderDate: new Date().toISOString().split("T")[0],
      isVerified: false,
      patientName: `${cachedData.patientFName} ${cachedData.patientMName} ${cachedData.patientLName}`.trim(),
      ancillary: cachedData.nameOfAgency,
      practice: cachedData.physicianGroup,
      practitioner: cachedData.billingProvider,
    });

    if (cachedData.profilePic) {
      setProfilePhoto(cachedData.profilePic);
    }
  }, [searchParams]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileError(null);
      if (file.type !== "application/pdf") {
        setFileError("Only PDF files are accepted. Please select a valid PDF document.");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setOrderDetails((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setOrderDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTextChange = (field: string, value: string) => {
    setOrderDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRemovePdf = () => {
    setSelectedFile(null);
    setPdfPreview(null);
    setFileError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please upload a PDF file");
      return;
    }

    setIsSubmitting(true);

    const patientId = searchParams.get("patientId") || "123";
    const soc = searchParams.get("soc") || "--";
    const soe = searchParams.get("soe") || "--";
    const eoe = searchParams.get("eoe") || "--";
    const today = new Date().toISOString().split("T")[0];

    const submissionData = {
      orderNo: `ORD${Date.now()}`, // Unique order number based on timestamp
      orderDate: orderDetails.orderDate,
      startOfCare: soc,
      episodeStartDate: soe,
      episodeEndDate: eoe,
      documentID: `DOC${Date.now()}`, // Unique document ID
      mrn: "MRN001", // Placeholder, update if available
      patientName: orderDetails.patientName,
      sentToPhysicianDate: today,
      sentToPhysicianStatus: true,
      signedByPhysicianDate: null,
      signedByPhysicianStatus: false,
      uploadedSignedOrderDate: null,
      uploadedSignedOrderStatus: false,
      documentName: selectedFile.name.replace(".pdf", ""),
      ehr: "Epic", // Placeholder, update if available
      account: "ACC001", // Placeholder
      location: "LocA", // Placeholder
      remarks: `${orderDetails.orderType} for ${orderDetails.episode}`,
      patientId: patientId,
      companyId: "COM001", // Placeholder
      entityType: "Order",
    };

    try {
      const response = await fetch("https://dawavorderpatient-hqe2apddbje9gte0.eastus-01.azurewebsites.net/api/Order", {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      console.log("Order submitted successfully:", await response.json());
      router.push(`/external/patients/${patientId}`);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-5 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">New Order Submission</h1>

        <div className="flex gap-6">
          {/* Left Section */}
          <div className="w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 p-6 relative">
            <button
              onClick={() => profilePhotoRef.current?.click()}
              className="absolute top-4 right-4 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-600 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <input
                type="file"
                ref={profilePhotoRef}
                accept="image/*"
                onChange={handleProfilePhotoSelect}
                className="hidden"
              />
            </button>

            <div className="text-center mb-6">
              <div
                className="w-24 h-24 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden cursor-pointer bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-700 shadow-sm"
                onClick={() => setShowPhotoPreview(true)}
              >
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Patient" className="w-full h-full object-cover" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>

              {showPhotoPreview && profilePhoto && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                  onClick={() => setShowPhotoPreview(false)}
                >
                  <div className="bg-white p-2 rounded-lg relative max-w-2xl max-h-2xl" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="absolute top-2 right-2 p-1 bg-white rounded-full text-gray-700 hover:text-gray-900"
                      onClick={() => setShowPhotoPreview(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <img src={profilePhoto} alt="Patient" className="max-h-[80vh] max-w-full" />
                  </div>
                </div>
              )}

              <input
                type="text"
                value={orderDetails.patientName}
                onChange={(e) => handleTextChange("patientName", e.target.value)}
                className="font-semibold text-lg text-gray-900 dark:text-white text-center border-b border-transparent hover:border-gray-300 focus:border-blue-400 focus:outline-none py-1 w-full bg-transparent"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">
                  Associated Ancillary
                </label>
                <input
                  type="text"
                  value={orderDetails.ancillary}
                  onChange={(e) => handleTextChange("ancillary", e.target.value)}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">
                  Associated Practice
                </label>
                <input
                  type="text"
                  value={orderDetails.practice}
                  onChange={(e) => handleTextChange("practice", e.target.value)}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">
                  Signing Practitioner
                </label>
                <input
                  type="text"
                  value={orderDetails.practitioner}
                  onChange={(e) => handleTextChange("practitioner", e.target.value)}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">
                  Type of Order <span className="text-red-500">*</span>
                </label>
                <select
                  name="orderType"
                  value={orderDetails.orderType}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Verbal Order">Verbal Order</option>
                  <option value="Written Order">Written Order</option>
                  <option value="485 Order">485 Order</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">
                  Selected Episode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={orderDetails.episode}
                  readOnly
                  className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">
                  Start of Care
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="startOfCare"
                    value={orderDetails.startOfCare}
                    readOnly
                    className="w-full p-2 pl-9 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">
                  Order Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="orderDate"
                    value={orderDetails.orderDate}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 pl-9 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={orderDetails.isVerified}
                  onChange={handleInputChange}
                  className="mt-1 mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I have carefully verified and reviewed this order.
                </span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!orderDetails.isVerified || !orderDetails.orderDate || !selectedFile || isSubmitting}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  !orderDetails.isVerified || !orderDetails.orderDate || !selectedFile || isSubmitting
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Send For Signing"}
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold text-gray-900 dark:text-white">PDF Preview</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload PDF
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {selectedFile && (
                  <button
                    onClick={handleRemovePdf}
                    className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                    title="Remove PDF"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="h-[580px]">
              {pdfPreview ? (
                <iframe
                  src={pdfPreview}
                  width="100%"
                  height="100%"
                  title="PDF Preview"
                  className="border-none"
                  style={{ backgroundColor: "white" }}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                  {fileError ? (
                    <div className="text-center px-6">
                      <svg className="w-16 h-16 text-red-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-red-600 font-medium text-lg mb-2">Invalid File Format</p>
                      <p className="text-gray-600 dark:text-gray-400">{fileError}</p>
                      <button
                        className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
                        onClick={() => setFileError(null)}
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="w-16 h-16 text-gray-300 mb-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-gray-500 dark:text-gray-400">Upload a PDF to preview</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UploadOrder: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <UploadOrderContent />
      </Suspense>
    </DashboardLayout>
  );
};

export default UploadOrder;