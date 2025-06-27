import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

export interface Appointment {
  id: string
  time: string
  type: 'In-Person' | 'Video'
  patient: string
  reason: string
  documents: number
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Overdue'
  date: string
  patientNote?: string
  videoNote?: string
  files?: string[]
  doctorId?: string
  doctorName?: string
  issue?: string
}

export interface Doctor {
  id: string
  name: string
  speciality: string
  failedToday: number
  totalAppointments: number
  completionRate: number
}

export interface Comment {
  id: string
  patientId: string
  patientName: string
  text: string
  doctorId?: string
  doctorName?: string
  timestamp: string
  status: 'Open' | 'Resolved'
}

export interface SupportSMS {
  id: string
  phone: string
  body: string
  timestamp: string
  status: 'Open' | 'Closed'
  senderName?: string
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  senderName: string
  text: string
  timestamp: string
  isRead: boolean
  fileUrl?: string
}

export interface Contact {
  id: string
  name: string
  type: 'patient' | 'doctor' | 'admin'
  unreadCount: number
  lastMessage?: string
  lastMessageTime?: string
}

interface DataContextType {
  appointments: Appointment[]
  doctors: Doctor[]
  comments: Comment[]
  supportSMS: SupportSMS[]
  messages: Message[]
  contacts: Contact[]
  stats: {
    availableAppointments: number
    overdueAppointments: number
    unreadMessages: number
    failedAppointments: number
    openSupportRequests: number
    newClientComments: number
  }
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void
  markAppointmentSolved: (id: string) => void
  requestDocs: (appointmentId: string, doctorId: string) => void
  assignDoctorToComment: (commentId: string, doctorId: string) => void
  markCommentResolved: (commentId: string) => void
  closeSupportTicket: (smsId: string) => void
  sendMessage: (receiverId: string, text: string, fileUrl?: string) => void
  markMessageAsRead: (messageId: string) => void
  uploadDocument: (appointmentId: string, file: File, type: string) => Promise<void>
  refreshData: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const useData = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [supportSMS, setSupportSMS] = useState<SupportSMS[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])

  // Mock data initialization
  useEffect(() => {
    if (user) {
      initializeMockData()
    }
  }, [user])

  const initializeMockData = () => {
    // Mock appointments
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        time: '09:00',
        type: 'In-Person',
        patient: 'John Smith',
        reason: 'Regular checkup',
        documents: 2,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        patientNote: 'Experiencing chest pain occasionally',
        doctorId: 'doc1',
        doctorName: 'Dr. Sarah Johnson'
      },
      {
        id: '2',
        time: '10:30',
        type: 'Video',
        patient: 'Emma Wilson',
        reason: 'Follow-up consultation',
        documents: 0,
        status: 'Confirmed',
        date: new Date().toISOString().split('T')[0],
        videoNote: 'Previous surgery follow-up',
        doctorId: 'doc1',
        doctorName: 'Dr. Sarah Johnson'
      },
      {
        id: '3',
        time: '08:00',
        type: 'In-Person',
        patient: 'Michael Brown',
        reason: 'Emergency consultation',
        documents: 1,
        status: 'Overdue',
        date: new Date().toISOString().split('T')[0],
        patientNote: 'Severe headache and dizziness',
        doctorId: 'doc2',
        doctorName: 'Dr. Michael Davis',
        issue: 'Unconfirmed'
      },
      {
        id: '4',
        time: '14:00',
        type: 'Video',
        patient: 'Lisa Anderson',
        reason: 'Consultation',
        documents: 0,
        status: 'Overdue',
        date: new Date().toISOString().split('T')[0],
        doctorId: 'doc2',
        doctorName: 'Dr. Michael Davis',
        issue: 'Docs Missing'
      }
    ]

    // Mock doctors
    const mockDoctors: Doctor[] = [
      {
        id: 'doc1',
        name: 'Dr. Sarah Johnson',
        speciality: 'Cardiology',
        failedToday: 1,
        totalAppointments: 8,
        completionRate: 87
      },
      {
        id: 'doc2',
        name: 'Dr. Michael Davis',
        speciality: 'Pediatrics',
        failedToday: 2,
        totalAppointments: 6,
        completionRate: 67
      },
      {
        id: 'doc3',
        name: 'Dr. Emily Chen',
        speciality: 'Dermatology',
        failedToday: 0,
        totalAppointments: 5,
        completionRate: 100
      }
    ]

    // Mock comments
    const mockComments: Comment[] = [
      {
        id: '1',
        patientId: 'pat1',
        patientName: 'John Smith',
        text: 'The doctor was very professional and explained everything clearly. However, I had to wait for 30 minutes past my appointment time.',
        doctorId: 'doc1',
        doctorName: 'Dr. Sarah Johnson',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'Open'
      },
      {
        id: '2',
        patientId: 'pat2',
        patientName: 'Emma Wilson',
        text: 'Great experience with the video consultation. The platform worked smoothly.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'Open'
      },
      {
        id: '3',
        patientId: 'pat3',
        patientName: 'Michael Brown',
        text: 'I need to reschedule my appointment but cannot find the option in the app.',
        doctorId: 'doc2',
        doctorName: 'Dr. Michael Davis',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        status: 'Open'
      }
    ]

    // Mock support SMS
    const mockSupportSMS: SupportSMS[] = [
      {
        id: '1',
        phone: '+1234567890',
        body: 'Hi, I cannot access my appointment details. Can you help?',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        status: 'Open',
        senderName: 'John Smith'
      },
      {
        id: '2',
        phone: '+1987654321',
        body: 'My doctor has not uploaded my prescription yet. When will it be available?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'Open',
        senderName: 'Emma Wilson'
      },
      {
        id: '3',
        phone: '+1122334455',
        body: 'Thank you for the quick response. Issue resolved.',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: 'Closed'
      }
    ]

    // Mock contacts (enhanced for supervisor)
    const mockContacts: Contact[] = [
      {
        id: '1',
        name: 'John Smith',
        type: 'patient',
        unreadCount: 2,
        lastMessage: 'Thank you for the consultation',
        lastMessageTime: '10:30 AM'
      },
      {
        id: '2',
        name: 'Dr. Michael Davis',
        type: 'doctor',
        unreadCount: 1,
        lastMessage: 'Can you review this case?',
        lastMessageTime: '9:15 AM'
      },
      {
        id: '3',
        name: 'Admin Support',
        type: 'admin',
        unreadCount: 0,
        lastMessage: 'System maintenance scheduled',
        lastMessageTime: 'Yesterday'
      },
      {
        id: '4',
        name: 'Emma Wilson',
        type: 'patient',
        unreadCount: 1,
        lastMessage: 'When will my results be ready?',
        lastMessageTime: '11:45 AM'
      },
      {
        id: '5',
        name: 'Dr. Sarah Johnson',
        type: 'doctor',
        unreadCount: 0,
        lastMessage: 'Patient documents uploaded',
        lastMessageTime: '2:30 PM'
      }
    ]

    // Mock messages
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: '1',
        receiverId: user!.id,
        senderName: 'John Smith',
        text: 'Hello Doctor, I have a question about my medication.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: false
      },
      {
        id: '2',
        senderId: user!.id,
        receiverId: '1',
        senderName: user!.name,
        text: 'Hi John, what specific question do you have?',
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        isRead: true
      }
    ]

    setAppointments(mockAppointments)
    setDoctors(mockDoctors)
    setComments(mockComments)
    setSupportSMS(mockSupportSMS)
    setContacts(mockContacts)
    setMessages(mockMessages)
  }

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, status } : apt)
    )
  }

  const markAppointmentSolved = (id: string) => {
    setAppointments(prev =>
      prev.map(apt => apt.id === id ? { ...apt, status: 'Confirmed', issue: undefined } : apt)
    )
  }

  const requestDocs = (appointmentId: string, doctorId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user!.id,
      receiverId: doctorId,
      senderName: user!.name,
      text: 'Please upload the required documents for your recent appointment.',
      timestamp: new Date().toISOString(),
      isRead: true
    }
    setMessages(prev => [...prev, newMessage])
  }

  const assignDoctorToComment = (commentId: string, doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId)
    setComments(prev =>
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, doctorId, doctorName: doctor?.name }
          : comment
      )
    )
  }

  const markCommentResolved = (commentId: string) => {
    setComments(prev =>
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, status: 'Resolved' }
          : comment
      )
    )
  }

  const closeSupportTicket = (smsId: string) => {
    setSupportSMS(prev =>
      prev.map(sms => 
        sms.id === smsId 
          ? { ...sms, status: 'Closed' }
          : sms
      )
    )
  }

  const sendMessage = (receiverId: string, text: string, fileUrl?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user!.id,
      receiverId,
      senderName: user!.name,
      text,
      timestamp: new Date().toISOString(),
      isRead: true,
      fileUrl
    }
    setMessages(prev => [...prev, newMessage])
  }

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg => msg.id === messageId ? { ...msg, isRead: true } : msg)
    )
  }

  const uploadDocument = async (appointmentId: string, file: File, type: string) => {
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In a real app, this would upload to Supabase Storage or S3
    const fileUrl = `https://example.com/files/${file.name}`
    
    // Update appointment with new document
    setAppointments(prev =>
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, files: [...(apt.files || []), fileUrl] }
          : apt
      )
    )
  }

  const refreshData = () => {
    // In a real app, this would refetch data from the API
    initializeMockData()
  }

  // Calculate stats based on user role
  const stats = {
    availableAppointments: appointments.filter(apt => apt.status === 'Pending').length,
    overdueAppointments: appointments.filter(apt => apt.status === 'Overdue').length,
    unreadMessages: contacts.reduce((sum, contact) => sum + contact.unreadCount, 0),
    failedAppointments: appointments.filter(apt => apt.status === 'Overdue').length,
    openSupportRequests: supportSMS.filter(sms => sms.status === 'Open').length,
    newClientComments: comments.filter(comment => 
      comment.status === 'Open' && 
      new Date(comment.timestamp).toDateString() === new Date().toDateString()
    ).length
  }

  return (
    <DataContext.Provider value={{
      appointments,
      doctors,
      comments,
      supportSMS,
      messages,
      contacts,
      stats,
      updateAppointmentStatus,
      markAppointmentSolved,
      requestDocs,
      assignDoctorToComment,
      markCommentResolved,
      closeSupportTicket,
      sendMessage,
      markMessageAsRead,
      uploadDocument,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  )
}