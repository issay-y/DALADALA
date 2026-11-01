export const initialShipments = [
  {
    id: 'SHP-1001',
    trackingNumber: 'TRK-1001',
    customer: 'Maya Stone',
    origin: 'Lagos',
    destination: 'Abuja',
    status: 'In Transit',
    eta: '2026-11-08',
    lastUpdated: '2026-11-01T09:15:00.000Z',
    notes: 'Courier is on the express route and expected to reach the final hub today.',
  },
  {
    id: 'SHP-1002',
    trackingNumber: 'TRK-1002',
    customer: 'Jude Adeyemi',
    origin: 'Port Harcourt',
    destination: 'Kano',
    status: 'Delayed',
    eta: '2026-11-10',
    lastUpdated: '2026-11-01T08:00:00.000Z',
    notes: 'Weather disruption is delaying the line-haul segment.',
  },
  {
    id: 'SHP-1003',
    trackingNumber: 'TRK-1003',
    customer: 'Tina Okafor',
    origin: 'Enugu',
    destination: 'Ibadan',
    status: 'Delivered',
    eta: '2026-10-30',
    lastUpdated: '2026-10-31T16:45:00.000Z',
    notes: 'Delivered to the consignee and signed for successfully.',
  },
]

export const initialFiles = [
  {
    id: 'FILE-01',
    name: 'invoice-TRK-1001.pdf',
    size: '240 KB',
    uploadedAt: '2026-11-01T09:40:00.000Z',
  },
  {
    id: 'FILE-02',
    name: 'proof-of-delivery-TRK-1003.pdf',
    size: '321 KB',
    uploadedAt: '2026-10-31T17:02:00.000Z',
  },
]
