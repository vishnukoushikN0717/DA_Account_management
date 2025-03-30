import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  ChevronDown,
  ChevronUp,
  Calendar,
  X,
  CheckCircle,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { number } from "zod";

interface TimelineEvent {
  id: number;
  type: string;
  date: string;
  status: "completed" | "in-progress" | "pending";
}

interface Order {
  id: string;
  number: string;
  type: string;
  status: "completed" | "in-progress" | "pending";
  timeline: TimelineEvent[];
}

interface Episode {
  number: string;
  status: string;
  timeline: TimelineEvent[];
  details: {
    startOfCare: string;
    startOfEpisode: string;
    endOfEpisode: string;
  };
  documents: any[];
}

interface Admission {
  id: string;
  number: string;
  status: string;
  episodes: Episode[];
  orders: Order[];
}

const MedicalDashboard = ({ id }: { id: string }) => {
  const [activeTab, setActiveTab] = useState("admissions");
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState<any>(null);
  const [orderDetails, setOrderDetails] = useState<Record<string, any>>({});
  const [expandedEpisodes, setExpandedEpisodes] = useState<string[]>([]);
  const [expandedAdmissions, setExpandedAdmissions] = useState<string[]>([]);
  const [showOrders, setShowOrders] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(
          `https://dawavorderpatient-hqe2apddbje9gte0.eastus-01.azurewebsites.net/api/Patient/total/${id}`,
          {
            headers: { Accept: "*/*" },
          }
        );
        const data = await response.json();

        // Cache basic patient data in localStorage
        const basicData = {
          patientFName: data.agencyInfo.patientFName || "--",
          patientMName: data.agencyInfo.patientMName || "--",
          patientLName: data.agencyInfo.patientLName || "--",
          profilePic: data.agencyInfo.profilePic || "/assets/default-profile.png",
          nameOfAgency: data.agencyInfo.nameOfAgency || "--",
          physicianGroup: data.agencyInfo.physicianGroup || "--",
          billingProvider: data.agencyInfo.billingProvider || "--",
        };
        localStorage.setItem(`patient_${id}`, JSON.stringify(basicData));

        // Check if careManagement exists and has data
        if (data.agencyInfo.careManagement && data.agencyInfo.careManagement.length > 0) {
          const careManagement = data.agencyInfo.careManagement[0];

          if (careManagement.admissions && careManagement.admissions.length > 0) {
            const latestAdmission = careManagement.admissions[careManagement.admissions.length - 1];
            setExpandedAdmissions([latestAdmission.admissionId]);

            if (latestAdmission.episodes && latestAdmission.episodes.length > 0) {
              const latestEpisode = latestAdmission.episodes[latestAdmission.episodes.length - 1];
              setExpandedEpisodes([latestEpisode.episodeId]);
              setShowOrders({ [latestEpisode.episodeId]: true });

              const allOrders = latestAdmission.episodes.flatMap((ep: any) => ep.documents || []);
              for (const order of allOrders) {
                fetchOrderDetails(order.orderId);
              }
            }
          }
        } else {
          console.warn("No careManagement data found for the patient.");
        }

        setPatientData(data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(
        `https://dawavorderpatient-hqe2apddbje9gte0.eastus-01.azurewebsites.net/api/Order/${orderId}`,
        {
          headers: { Accept: "*/*" },
        }
      );
      const data = await response.json();
      setOrderDetails((prev) => ({ ...prev, [orderId]: data }));
    } catch (error) {
      console.error(`Error fetching order details for ${orderId}:`, error);
    }
  };

  const handleTabChange = (tab: string) => {
    setLoading(true);
    setActiveTab(tab);
    setTimeout(() => setLoading(false), 400);
  };

  const toggleEpisode = (episodeId: string) => {
    setExpandedEpisodes((prev) =>
      prev.includes(episodeId) ? prev.filter((ep) => ep !== episodeId) : [...prev, episodeId]
    );
  };

  const toggleAdmission = (admissionId: string) => {
    setExpandedAdmissions((prev) =>
      prev.includes(admissionId) ? prev.filter((ad) => ad !== admissionId) : [...prev, admissionId]
    );
  };

  const toggleOrders = (episodeId: string) => {
    setShowOrders((prev) => ({
      ...prev,
      [episodeId]: !prev[episodeId],
    }));
  };

  const handleViewOrder = (orderId: string) => {
    console.log(`View order with ID: ${orderId}`);
  };

  const handleUploadOrder = (episode: Episode) => {
    const { startOfCare, startOfEpisode, endOfEpisode } = episode.details;
    const query = new URLSearchParams({
      soc: encodeURIComponent(startOfCare),
      soe: encodeURIComponent(startOfEpisode),
      eoe: encodeURIComponent(endOfEpisode),
      episodeNo: encodeURIComponent(episode.number),
      patientId: encodeURIComponent(id),
    }).toString();
    router.push(`/external/patients/order-upload?${query}`);
  };

  if (!patientData) return <div>Loading...</div>;

  const careManagement = patientData.agencyInfo.careManagement && patientData.agencyInfo.careManagement.length > 0
    ? patientData.agencyInfo.careManagement[0]
    : null;

  const latestAdmission = careManagement && careManagement.admissions && careManagement.admissions.length > 0
    ? careManagement.admissions[careManagement.admissions.length - 1]
    : null;

  const latestEpisode = latestAdmission && latestAdmission.episodes && latestAdmission.episodes.length > 0
    ? latestAdmission.episodes[latestAdmission.episodes.length - 1]
    : null;

  if (!careManagement || !latestAdmission || !latestEpisode) {
    return <div>No data available for this patient.</div>;
  }

  const isOngoing = (endOfEpisode: string) => {
    const today = new Date("2025-03-13");
    const eoeDate = new Date(endOfEpisode);
    return today < eoeDate ? "Ongoing" : "Completed";
  };

  const admissions: Admission[] = careManagement.admissions
    .map((adm: any) => ({
      id: adm.admissionId,
      number: adm.admissionNo,
      status: isOngoing(adm.episodes[adm.episodes.length - 1].endOfEpisode),
      episodes: adm.episodes
        .map((ep: any) => ({
          number: ep.episodeNo,
          status: isOngoing(ep.endOfEpisode) === "Ongoing" ? "current" : "completed",
          timeline: [],
          details: {
            startOfCare: ep.startOfCare || "--",
            startOfEpisode: ep.startOfEpisode || "--",
            endOfEpisode: ep.endOfEpisode || "--",
          },
          documents: ep.documents,
        }))
        .reverse(),
      orders: [],
    }))
    .reverse();

  const getOrdersForEpisode = (documents: any[]): Order[] => {
    const priorityOrders = ["485", "Cert", "Recert", "Plan of Care", "F2F", "Face-to-face"];
    const orders: Order[] = documents.map((doc) => {
      const orderDetail = orderDetails[doc.orderId] || {};
      return {
        id: doc.orderId,
        number: orderDetail.orderNo || "--",
        type: doc.docName || "--",
        status: doc.docStatus === "Pending" ? "pending" : "completed",
        timeline: [
          {
            id: 1,
            type: "Sent to Physician",
            date: orderDetail.sentToPhysicianStatus ? orderDetail.sentToPhysicianDate || "--" : "--",
            status: orderDetail.sentToPhysicianStatus ? "completed" : "pending",
          },
          {
            id: 2,
            type: "Signed",
            date: orderDetail.signedByPhysicianStatus ? orderDetail.signedByPhysicianDate || "--" : "--",
            status: orderDetail.signedByPhysicianStatus ? "completed" : "pending",
          },
          {
            id: 3,
            type: "Filed",
            date: orderDetail.uploadedSignedOrderStatus ? orderDetail.uploadedSignedOrderDate || "--" : "--",
            status: orderDetail.uploadedSignedOrderStatus ? "completed" : "pending",
          },
        ],
      };
    });

    const prioritized = orders.filter((order) => priorityOrders.some((p) => order.type.toLowerCase().includes(p.toLowerCase())));
    const rest = orders.filter((order) => !priorityOrders.some((p) => order.type.toLowerCase().includes(p.toLowerCase()))).reverse();
    return [...prioritized, ...rest];
  };

  const personalDetails = {
    patientFirstName: patientData.agencyInfo.patientFName || "--",
    patientMiddleName: patientData.agencyInfo.patientMName || "--",
    patientLastName: patientData.agencyInfo.patientLName || "--",
    patientDOB: patientData.agencyInfo.dob || "--",
    patientAge: patientData.agencyInfo.age || "--",
    patientGender: patientData.agencyInfo.patientSex || "--",
    patientMaritalStatus: patientData.agencyInfo.maritalStatus || "--",
    patientSSN: patientData.agencyInfo.ssn || "--",
    email: patientData.email || "--",
    phoneNumber: patientData.phoneNumber || "--",
    patientStatus: patientData.agencyInfo.patientStatus || "--",
    careManagementServices: patientData.agencyInfo.careManagement[0].careManagementType || "--",
  };

  const medicalInfo = {
    diagnosis: {
      primaryDiagnosis: latestEpisode.firstDiagnosis || "--",
      secondDiagnosis: latestEpisode.secondDiagnosis || "--",
      thirdDiagnosis: latestEpisode.thirdDiagnosis || "--",
      fourthDiagnosis: latestEpisode.fourthDiagnosis || "--",
      fifthDiagnosis: latestEpisode.fifthDiagnosis || "--",
      sixthDiagnosis: latestEpisode.sixthDiagnosis || "--",
    },
    provider: {
      billingProvider: {
        name: patientData.agencyInfo.billingProvider || "--",
        npi: patientData.agencyInfo.npi || "--",
        phoneNo: patientData.agencyInfo.billingProviderPhoneNo || "--",
        address: patientData.agencyInfo.billingProviderAddress || "--",
      },
      supervisingProvider: {
        name: patientData.agencyInfo.supervisingProvider || "--",
        npi: patientData.agencyInfo.supervisingProviderNPI || "--",
      },
    },
    insurance: {
      paymentSource: patientData.agencyInfo.payorSource || "--",
      primaryInsuranceName: patientData.agencyInfo.primaryInsuranceName || "--",
      primaryInsuranceID: patientData.agencyInfo.insuranceId || "--",
      secondaryInsuranceName: patientData.agencyInfo.secondaryInsuranceName || "--",
      secondaryInsuranceID: patientData.agencyInfo.secondaryInsuranceID || "--",
      tertiaryInsuranceName: patientData.agencyInfo.tertiaryInsuranceName || "--",
      tertiaryInsuranceID: patientData.agencyInfo.tertiaryInsuranceID || "--",
    },
  };

  const StatusIcon = ({ status }: { status: "completed" | "in-progress" | "pending" }) => {
    return (
      <span className="inline-flex items-center">
        {status === "completed" ? (
          <CheckCircle size={14} className="text-green-600 dark:text-green-300 mr-1" />
        ) : (
          <X size={14} className="text-red-600 dark:text-red-400 mr-1" />
        )}
      </span>
    );
  };

  const renderPersonalDetails = () => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 p-6 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Full Name</span>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {personalDetails.patientFirstName} {personalDetails.patientMiddleName} {personalDetails.patientLastName}
            </span>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Date of Birth</span>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700 flex items-center">
            <Calendar size={12} className="text-gray-600 dark:text-gray-300 mr-2" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{personalDetails.patientDOB}</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Age</span>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{personalDetails.patientAge} Years</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Gender</span>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{personalDetails.patientGender}</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Marital Status</span>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{personalDetails.patientMaritalStatus}</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">SSN</span>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{personalDetails.patientSSN}</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Email</span>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 break-all">{personalDetails.email}</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Phone Number</span>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{personalDetails.phoneNumber}</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Patient Status</span>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
            <span
              className={cn(
                "text-sm font-medium px-2 py-1 rounded-full inline-block",
                personalDetails.patientStatus === "Active"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}
            >
              {personalDetails.patientStatus}
            </span>
          </div>
        </div>
        <div>
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Care Management Services</span>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{personalDetails.careManagementServices}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 p-6 mb-8">
      <div className="space-y-8">
        {/* Diagnosis Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Diagnosis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Primary Diagnosis</span>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.diagnosis.primaryDiagnosis}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">2nd Diagnosis</span>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.diagnosis.secondDiagnosis}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">3rd Diagnosis</span>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.diagnosis.thirdDiagnosis}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">4th Diagnosis</span>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.diagnosis.fourthDiagnosis}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">5th Diagnosis</span>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.diagnosis.fifthDiagnosis}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">6th Diagnosis</span>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.diagnosis.sixthDiagnosis}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Provider Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Providers</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Billing Provider</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Name</span>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.provider.billingProvider.name}</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">NPI</span>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.provider.billingProvider.npi}</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Phone No.</span>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.provider.billingProvider.phoneNo}</span>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Address</span>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.provider.billingProvider.address}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">Supervising Provider</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Name</span>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.provider.supervisingProvider.name}</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">NPI</span>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.provider.supervisingProvider.npi}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insurance Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Insurance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Payment Source</span>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.insurance.paymentSource}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Primary Insurance Name</span>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.insurance.primaryInsuranceName}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Primary Insurance ID</span>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.insurance.primaryInsuranceID}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Secondary Insurance Name</span>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.insurance.secondaryInsuranceName}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Secondary Insurance ID</span>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.insurance.secondaryInsuranceID}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Tertiary Insurance Name</span>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.insurance.tertiaryInsuranceName}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium block mb-1">Tertiary Insurance ID</span>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg border border-gray-300 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{medicalInfo.insurance.tertiaryInsuranceID}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-8 sm:px-8 max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-300 dark:border-gray-700 mb-8 overflow-hidden">
            {/* Patient Info */}
            <div className="p-6 flex flex-col sm:flex-row items-start gap-6">
              <div className="flex items-start gap-4 w-full sm:w-auto">
                <img
                  src={patientData.agencyInfo.profilePic || "/assets/default-profile.png"}
                  alt="Patient Profile"
                  className="w-24 h-24 object-cover rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {patientData.agencyInfo.patientFName} {patientData.agencyInfo.patientMName} {patientData.agencyInfo.patientLName}
                    </h1>
                    <span className="text-gray-600 dark:text-gray-400 font-normal text-lg">
                      ({patientData.agencyInfo.age || "--"} Yrs)
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex gap-1">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Practice Name:</span>
                      <span className="text-gray-800 dark:text-gray-200">{patientData.agencyInfo.physicianGroup || "--"}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Billing Provider:</span>
                      <span className="text-gray-800 dark:text-gray-200">{patientData.agencyInfo.billingProvider || "--"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:ml-auto text-sm w-full sm:w-auto flex items-center justify-center">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-300 dark:border-gray-700 w-full sm:w-64">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">485 Cert</span>
                    {latestEpisode.isValid485 ? (
                      <CheckCircle size={16} className="text-green-600 dark:text-green-300" />
                    ) : (
                      <X size={16} className="text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">F2F Conditions</span>
                    {latestEpisode.isValidF2F ? (
                      <CheckCircle size={16} className="text-green-600 dark:text-green-300" />
                    ) : (
                      <X size={16} className="text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-300 dark:border-gray-700 flex flex-wrap">
              {["Admissions & Episodes", "Medical Info", "Personal Details"].map((tab, index) => (
                <button
                  key={index}
                  className={cn(
                    "py-4 px-6 text-sm font-medium relative transition-colors duration-300",
                    activeTab === tab.toLowerCase().split(" ")[0]
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                  )}
                  onClick={() => handleTabChange(tab.toLowerCase().split(" ")[0])}
                >
                  {tab}
                  {activeTab === tab.toLowerCase().split(" ")[0] && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
              <div className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            </div>
          ) : (
            <>
              {activeTab === "admissions" &&
                admissions.map((admission) => (
                  <div
                    key={admission.id}
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 mb-8 overflow-hidden transition-all duration-300"
                  >
                    <div
                      className={cn(
                        "bg-gray-50 dark:bg-gray-900/50 py-4 px-6 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between cursor-pointer transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800/50",
                        expandedAdmissions.includes(admission.id) ? "" : "rounded-b-2xl"
                      )}
                      onClick={() => toggleAdmission(admission.id)}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                          Admission {admission.number}
                        </span>
                        {admission.status === "Ongoing" ? (
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                            Ongoing
                          </span>
                        ) : (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                            Completed
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span>{admission.episodes.length} Episodes</span>
                        </div>
                        {expandedAdmissions.includes(admission.id) ? (
                          <ChevronUp size={18} className="text-gray-600 dark:text-gray-300" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-600 dark:text-gray-300" />
                        )}
                      </div>
                    </div>

                    {expandedAdmissions.includes(admission.id) && (
                      <div className="p-6 space-y-6">
                        {admission.episodes.map((episode) => {
                          const orders = getOrdersForEpisode(episode.documents);
                          return (
                            <div
                              key={episode.number}
                              className={cn(
                                "border rounded-xl transition-all duration-300",
                                episode.status === "current"
                                  ? "border-blue-200 dark:border-blue-700/50 shadow-lg"
                                  : "border-gray-300 dark:border-gray-700 shadow-md"
                              )}
                            >
                              <div
                                className={cn(
                                  "py-4 px-6 flex justify-between items-center cursor-pointer transition-colors duration-200",
                                  episode.status === "current"
                                    ? "bg-blue-50 dark:bg-blue-900/20"
                                    : "bg-white dark:bg-gray-900",
                                  expandedEpisodes.includes(episode.number)
                                    ? "border-b border-gray-300 dark:border-gray-700"
                                    : "rounded-b-xl"
                                )}
                                onClick={() => toggleEpisode(episode.number)}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
                                    Episode {episode.number}
                                  </span>
                                  {episode.status === "current" && (
                                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                      (Current)
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {episode.documents.length} Orders
                                  </span>
                                  {expandedEpisodes.includes(episode.number) ? (
                                    <ChevronUp size={18} className="text-gray-600 dark:text-gray-300" />
                                  ) : (
                                    <ChevronDown size={18} className="text-gray-600 dark:text-gray-300" />
                                  )}
                                </div>
                              </div>

                              {expandedEpisodes.includes(episode.number) && (
                                <div className="p-6 bg-white dark:bg-gray-900">
                                  <div className="relative flex items-center justify-between mb-6 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-300 dark:border-gray-700">
                                    <div className="flex flex-col items-center">
                                      <span className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">SOC</span>
                                      <div className="flex items-center">
                                        <Calendar size={14} className="text-gray-600 dark:text-gray-300 mr-1" />
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                          {episode.details.startOfCare}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <span className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">SOE</span>
                                      <div className="flex items-center">
                                        <Calendar size={14} className="text-gray-600 dark:text-gray-300 mr-1" />
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                          {episode.details.startOfEpisode}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <span className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">EOE</span>
                                      <div className="flex items-center">
                                        <Calendar size={14} className="text-gray-600 dark:text-gray-300 mr-1" />
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                          {episode.details.endOfEpisode}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="absolute -bottom-3 right-4 flex gap-2">
                                      <button
                                        onClick={() => toggleOrders(episode.number)}
                                        className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/70 transition-colors duration-200 border border-gray-300 dark:border-gray-700"
                                        title={showOrders[episode.number] ? "Hide Orders" : "Show Orders"}
                                      >
                                        {showOrders[episode.number] ? <EyeOff size={15} /> : <Eye size={15} />}
                                      </button>
                                      <button
                                        onClick={() => handleUploadOrder(episode)}
                                        className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/70 transition-colors duration-200 border border-gray-300 dark:border-gray-700"
                                        title="Upload Order"
                                      >
                                        <Upload size={15} />
                                      </button>
                                    </div>
                                  </div>

                                  {showOrders[episode.number] && (
                                    <div className="space-y-4">
                                      {orders.map((order) => (
                                        <div
                                          key={order.id}
                                          className="relative p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-300 dark:border-gray-700"
                                        >
                                          <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-center gap-2 min-w-[100px]">
                                              <FileText size={16} className="text-gray-600 dark:text-gray-300" />
                                              <div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                  {order.type}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 block">
                                                  {order.number}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="flex-1 flex items-start gap-1">
                                              {order.timeline.map((event) => (
                                                <div
                                                  key={event.id}
                                                  className="flex-1 flex flex-col items-center gap-1 text-sm min-w-[80px]"
                                                >
                                                  <div className="flex items-center gap-1">
                                                    <StatusIcon status={event.status} />
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                                                      {event.type}
                                                    </span>
                                                  </div>
                                                  {event.status === "completed" && (
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                      {event.date}
                                                    </span>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                          <button
                                            onClick={() => handleViewOrder(order.id)}
                                            className="absolute bottom-2 right-2 p-2 bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/70 transition-colors duration-200 border border-gray-300 dark:border-gray-700"
                                            title="View Order"
                                          >
                                            <Eye size={16} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

              {activeTab === "medical" && renderMedicalInfo()}
              {activeTab === "personal" && renderPersonalDetails()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalDashboard;