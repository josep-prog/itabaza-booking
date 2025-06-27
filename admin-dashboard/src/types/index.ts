export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'doctor' | 'supervisor';
  status: 'active' | 'inactive';
  createdAt: string;
  specialization?: string; // For doctors
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  patientName: string;
  amount: number;
  txId: string;
  appointmentId?: string;
  status: 'confirmed' | 'pending' | 'failed';
  timestamp: string;
  paymentMethod: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface DashboardStats {
  appointmentsToday: number;
  paymentsToday: number;
  failedAppointments: number;
  completedAppointments: number;
}