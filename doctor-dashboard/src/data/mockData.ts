import { User, Appointment, Payment, Message, DashboardStats } from '../types';

export const mockDoctors: User[] = [
  {
    id: '1',
    name: 'Dr. Jean Baptiste',
    email: 'jean.baptiste@itabaza.com',
    phone: '+250123456789',
    role: 'doctor',
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    specialization: 'Cardiology',
  },
  {
    id: '2',
    name: 'Dr. Marie Claire',
    email: 'marie.claire@itabaza.com',
    phone: '+250123456790',
    role: 'doctor',
    status: 'active',
    createdAt: '2024-01-20T08:00:00Z',
    specialization: 'Pediatrics',
  },
  {
    id: '3',
    name: 'Dr. Paul Ntare',
    email: 'paul.ntare@itabaza.com',
    phone: '+250123456791',
    role: 'doctor',
    status: 'inactive',
    createdAt: '2024-02-01T08:00:00Z',
    specialization: 'Surgery',
  },
];

export const mockSupervisors: User[] = [
  {
    id: '4',
    name: 'Alice Mukamana',
    email: 'alice.mukamana@itabaza.com',
    phone: '+250123456792',
    role: 'supervisor',
    status: 'active',
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    id: '5',
    name: 'Robert Nzeyimana',
    email: 'robert.nzeyimana@itabaza.com',
    phone: '+250123456793',
    role: 'supervisor',
    status: 'active',
    createdAt: '2024-01-25T08:00:00Z',
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Grace Uwimana',
    patientPhone: '+250781234567',
    doctorId: '1',
    doctorName: 'Dr. Jean Baptiste',
    appointmentDate: '2024-12-20',
    appointmentTime: '09:00',
    status: 'confirmed',
    notes: 'Follow-up consultation',
    createdAt: '2024-12-19T10:00:00Z',
  },
  {
    id: '2',
    patientName: 'Emmanuel Habimana',
    patientPhone: '+250781234568',
    doctorId: '2',
    doctorName: 'Dr. Marie Claire',
    appointmentDate: '2024-12-20',
    appointmentTime: '10:30',
    status: 'pending',
    notes: 'Regular checkup',
    createdAt: '2024-12-19T11:00:00Z',
  },
  {
    id: '3',
    patientName: 'Sandrine Nyirahabimana',
    patientPhone: '+250781234569',
    doctorId: '1',
    doctorName: 'Dr. Jean Baptiste',
    appointmentDate: '2024-12-20',
    appointmentTime: '14:00',
    status: 'completed',
    notes: 'Annual physical exam',
    createdAt: '2024-12-18T09:00:00Z',
  },
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    patientName: 'Grace Uwimana',
    amount: 25000,
    txId: 'TX001234567890',
    appointmentId: '1',
    status: 'confirmed',
    timestamp: '2024-12-19T14:30:00Z',
    paymentMethod: 'Mobile Money',
  },
  {
    id: '2',
    patientName: 'Emmanuel Habimana',
    amount: 30000,
    txId: 'TX001234567891',
    appointmentId: '2',
    status: 'pending',
    timestamp: '2024-12-19T15:45:00Z',
    paymentMethod: 'Mobile Money',
  },
  {
    id: '3',
    patientName: 'Sandrine Nyirahabimana',
    amount: 20000,
    txId: 'TX001234567892',
    appointmentId: '3',
    status: 'confirmed',
    timestamp: '2024-12-18T16:20:00Z',
    paymentMethod: 'Cash',
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'admin',
    senderName: 'Admin',
    receiverId: '1',
    receiverName: 'Dr. Jean Baptiste',
    content: 'Please review the patient files for tomorrow\'s appointments.',
    timestamp: '2024-12-19T08:00:00Z',
    read: true,
  },
  {
    id: '2',
    senderId: '1',
    senderName: 'Dr. Jean Baptiste',
    receiverId: 'admin',
    receiverName: 'Admin',
    content: 'Files reviewed. All patients are confirmed for tomorrow.',
    timestamp: '2024-12-19T08:30:00Z',
    read: false,
  },
  {
    id: '3',
    senderId: 'admin',
    senderName: 'Admin',
    receiverId: '4',
    receiverName: 'Alice Mukamana',
    content: 'Can you help coordinate the afternoon schedules?',
    timestamp: '2024-12-19T10:15:00Z',
    read: false,
  },
];

export const mockDashboardStats: DashboardStats = {
  appointmentsToday: 12,
  paymentsToday: 450000,
  failedAppointments: 2,
  completedAppointments: 8,
};