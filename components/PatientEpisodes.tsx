// components/PatientEpisodes.tsx
import React, { useState } from 'react';

interface Episode {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  days: number;
  billingProvider: string;
  orders: Order[];
}

interface Order {
  id: number;
  type: string;
  receivedDate: string;
  statusTimeline: { status: string; date: string }[];
}

const PatientEpisodes: React.FC = () => {
  const [openCards, setOpenCards] = useState<number[]>([3]); // Default open card is Episode 3

  const toggleCard = (id: number) => {
    setOpenCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const episodes: Episode[] = [
    {
      id: 1,
      title: 'Episode 1',
      startDate: '01/15/2024',
      endDate: '02/20/2024',
      status: 'F2P Valid',
      days: 60,
      billingProvider: 'Dr. Theresa Webb',
      orders: [],
    },
    {
      id: 2,
      title: 'Episode 2',
      startDate: '01/15/2024',
      endDate: '02/20/2024',
      status: 'F2P Valid',
      days: 60,
      billingProvider: 'Dr. Theresa Webb',
      orders: [],
    },
    {
      id: 3,
      title: 'Episode 3 (Current)',
      startDate: '04/20/2024',
      endDate: '06/20/2024',
      status: 'Ongoing',
      days: 2,
      billingProvider: 'Dr. Theresa Webb',
      orders: [
        {
          id: 1,
          type: 'order',
          receivedDate: '1 May 2024',
          statusTimeline: [
            { status: 'Received', date: '1 May 2024' },
            { status: 'Ongoing', date: '' },
            { status: 'Signed', date: '' },
            { status: 'Filed', date: '' },
          ],
        },
        {
          id: 2,
          type: 'order',
          receivedDate: '12 Feb 2024',
          statusTimeline: [
            { status: 'Received', date: '12 Feb 2024' },
            { status: 'Proposed', date: '13 Feb 2024' },
            { status: 'Signed', date: '17 Feb 2024' },
            { status: 'Filed', date: '17 Feb 2024' },
          ],
        },
        {
          id: 3,
          type: '485 Cert',
          receivedDate: '1 Jan 2024',
          statusTimeline: [
            { status: 'Received', date: '1 Jan 2024' },
            { status: 'Proposed', date: '3 Jan 2024' },
            { status: 'Signed', date: '6 Jan 2024' },
            { status: 'Filed', date: '6 Jan 2024' },
            { status: 'Claim Submitted', date: '6 Jan 2024' },
            { status: 'Claim Processed', date: '8 Jan 2024' },
          ],
        },
      ],
    },
  ];

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Admissions & Episodes</h2>
      <div className="space-y-3">
        {episodes.map((episode) => (
          <div key={episode.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div
              className="flex justify-between items-center p-3 bg-gray-100 cursor-pointer"
              onClick={() => toggleCard(episode.id)}
            >
              <h3 className="text-base font-medium">
                {episode.title} <span className="text-gray-500">({episode.days} Days)</span>
              </h3>
              <button className="text-lg">
                {openCards.includes(episode.id) ? '▼' : '▶'}
              </button>
            </div>
            {openCards.includes(episode.id) && (
              <div className="p-3">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm">SOE {episode.startDate}</span>
                  <span className="text-sm">EOE {episode.endDate}</span>
                  <span className="flex items-center gap-2 text-sm">
                    {episode.status === 'Ongoing' && (
                      <span className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
                        C
                      </span>
                    )}
                    {episode.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span>Billing Provider: {episode.billingProvider}</span>
                  <span>Start of Care: {episode.startDate}</span>
                  <span>Start of Episode: {episode.startDate}</span>
                  <span>End of Episode: {episode.endDate}</span>
                </div>
                {episode.orders.map((order) => (
                  <div key={order.id} className="mt-3 p-3 border border-gray-100 rounded-lg">
                    <div className="flex justify-between mb-2 text-sm">
                      <span>{order.type}</span>
                      <span>Received: {order.receivedDate}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      {order.statusTimeline.map((status, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full border-2 ${
                              status.status === 'Received' ||
                              status.status === 'Signed' ||
                              status.status === 'Filed' ||
                              status.status === 'Claim Processed'
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-400'
                            }`}
                          />
                          <div className="text-xs">
                            <div>{status.status}</div>
                            <div>{status.date || ''}</div>
                          </div>
                          {index < order.statusTimeline.length - 1 && (
                            <div className="w-px h-5 bg-gray-300 ml-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="mt-3 text-sm border border-gray-300 rounded px-3 py-1 hover:bg-gray-100">
                  Hide Order List
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientEpisodes;