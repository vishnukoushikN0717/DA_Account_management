"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Building2,
  Users,
  UserCog,
  Home,
  Heart,
  User,
  Phone,
  Database,
  Shield,
  ChevronRight
} from "lucide-react";

interface EntityData {
  pg: number;
  physicians: number;
  npp: number;
  homeHealth: number;
  hospice: number;
  corporate: number;
  patients: number;
  contacts: number;
  ehr: number;
  insurance: number;
  totalPractitioners: number;
  totalAncillaries: number;
}

export default function MarketAnalysis() {
  const router = useRouter();
  const [data, setData] = useState<EntityData>({
    pg: 0,
    physicians: 0,
    npp: 0,
    homeHealth: 0,
    hospice: 0,
    corporate: 0,
    patients: 46, // Note: No API provided for patients, keeping static
    contacts: 0,
    ehr: 0,
    insurance: 0,
    totalPractitioners: 0,
    totalAncillaries: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://dawaventity-g5a6apetdkambpcu.eastus-01.azurewebsites.net/api/Entity/AllCount',
          {
            headers: { 'accept': '*/*' }
          }
        );
        const result = await response.json();

        // Extract counts from the response
        const contactsCount = result.contact.active;
        const totalPractitioners = result.practitioner.active;
        const physiciansCount = result.practitioner.breakdown.Physician.Active;
        const nppCount = result.practitioner.breakdown.NPP.Active;
        const totalAncillaries = result.entity.ancilliary.total;
        const homeHealthCount = result.entity.ancilliary.subtypes["Home Health Agency"].Active;
        const hospiceCount = result.entity.ancilliary.subtypes.Hospice.Active;
        const practiceCount = result.entity.others.PRACTICE.TotalCounts.Active;
        const corporateCount = result.entity.others.CORPORATE.TotalCounts.Active;
        const ehrCount = result.entity.others.EHR.TotalCounts.Active;
        const insuranceCount = result.entity.others.INSURANCE.TotalCounts.Active;

        setData({
          pg: practiceCount,
          physicians: physiciansCount,
          npp: nppCount,
          homeHealth: homeHealthCount,
          hospice: hospiceCount,
          corporate: corporateCount,
          patients: 46, // Static as no API provided
          contacts: contactsCount,
          ehr: ehrCount,
          insurance: insuranceCount,
          totalPractitioners: totalPractitioners,
          totalAncillaries: totalAncillaries
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Rest of the component remains the same
  const leftGroups = [
    {
      title: "Practice",
      total: data.pg,
      color: "from-blue-600 to-blue-400",
      items: [
        {
          name: "PG",
          value: data.pg,
          icon: Building2,
          route: "/market-analysis/entities/practice/landing"
        }
      ]
    },
    {
      title: "Practitioners",
      total: data.totalPractitioners,
      color: "from-purple-600 to-purple-400",
      headerRoute: "/market-analysis/entities/practitioner/landing",
      items: [
        {
          name: "Physicians",
          value: data.physicians,
          icon: Users,
          route: "/market-analysis/entities/practitioner/physicians"
        },
        {
          name: "NPP",
          value: data.npp,
          icon: UserCog,
          route: "/market-analysis/entities/practitioner/npp"
        }
      ]
    },
    {
      title: "Ancillaries",
      total: data.totalAncillaries,
      color: "from-orange-600 to-orange-400",
      headerRoute: "/market-analysis/entities/ancillaries/landing",
      items: [
        {
          name: "Home Health Agency",
          value: data.homeHealth,
          icon: Home,
          route: "/market-analysis/entities/ancillaries/HHA"
        },
        {
          name: "Hospice",
          value: data.hospice,
          icon: Heart,
          route: "/market-analysis/entities/ancillaries/Hospice"
        }
      ]
    }
  ];

  const rightCards = [
    {
      title: "Corporate",
      icon: Building2,
      value: data.corporate,
      route: "/market-analysis/entities/corporate/landing",
      color: "from-indigo-600 to-indigo-400"
    },
    {
      title: "Patients",
      icon: User,
      value: data.patients,
      route: "/patients",
      color: "from-pink-600 to-pink-400"
    },
    {
      title: "Contacts",
      icon: Phone,
      value: data.contacts,
      route: "/market-analysis/entities/contacts/landing",
      color: "from-teal-600 to-teal-400"
    },
    {
      title: "EHR",
      icon: Database,
      value: data.ehr,
      route: "/market-analysis/entities/ehr/landing",
      color: "from-cyan-600 to-cyan-400"
    },
    {
      title: "Insurance",
      icon: Shield,
      value: data.insurance,
      route: "/market-analysis/entities/insurance/landing",
      color: "from-amber-600 to-amber-400"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4">
        <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">Market Analysis</h1>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="space-y-6">
          {leftGroups.map((group) => (
            <Card key={group.title} className="shadow-md overflow-hidden">
              <CardHeader 
                className={`bg-gradient-to-r ${group.color} py-3 ${group.headerRoute ? 'cursor-pointer hover:opacity-90' : ''}`}
                onClick={() => group.headerRoute && router.push(group.headerRoute)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium text-white">
                    {group.title}
                  </CardTitle>
                  <span className="text-lg font-bold">
                    {group.total.toLocaleString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer group"
                    onClick={() => router.push(item.route)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{item.value.toLocaleString()}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="col-span-2">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardContent className="p-0 aspect-[4/3] relative overflow-hidden rounded-lg">
              <Image
                src="https://i.ibb.co/nszCw6r4/usa.jpg"
                alt="USA Map"
                fill
                className="object-cover"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Other Entities
          </div>
          {rightCards.map((card) => (
            <Card 
              key={card.title}
              className="shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden group"
              onClick={() => router.push(card.route)}
            >
              <div className={`bg-gradient-to-r ${card.color} p-4 transition-all duration-200`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <card.icon className="h-5 w-5 text-white" />
                    <span className="text-white font-medium">{card.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{card.value.toLocaleString()}</span>
                    <ChevronRight className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}