import React from 'react'
import { Calendar, Clock, MessageSquare, TrendingUp } from 'lucide-react'
import { useData } from '../contexts/DataContext'

const Dashboard: React.FC = () => {
  const { stats, appointments } = useData()

  const cards = [
    {
      title: 'Available Appointments',
      value: stats.availableAppointments,
      description: 'Pending bookings for today',
      icon: Calendar,
      color: 'primary',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
      textColor: 'text-primary-900'
    },
    {
      title: 'Overdue / Uncompleted',
      value: stats.overdueAppointments,
      description: 'Past scheduled time',
      icon: Clock,
      color: stats.overdueAppointments > 0 ? 'danger' : 'gray',
      bgColor: stats.overdueAppointments > 0 ? 'bg-danger-50' : 'bg-gray-50',
      iconColor: stats.overdueAppointments > 0 ? 'text-danger-600' : 'text-gray-600',
      textColor: stats.overdueAppointments > 0 ? 'text-danger-900' : 'text-gray-900',
      pulse: stats.overdueAppointments > 0
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      description: 'New messages waiting',
      icon: MessageSquare,
      color: 'success',
      bgColor: 'bg-success-50',
      iconColor: 'text-success-600',
      textColor: 'text-success-900'
    }
  ]

  const todayAppointments = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0]
  ).sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Good morning, Dr. Johnson!</h1>
        <p className="text-primary-100">
          You have {stats.availableAppointments} appointments scheduled for today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className={`
                ${card.bgColor} rounded-lg p-6 border border-gray-200 card-hover
                ${card.pulse ? 'animate-pulse' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className={`text-3xl font-bold ${card.textColor}`}>
                    {card.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {card.description}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">
                        {appointment.time}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.type}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.patient}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.reason}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {appointment.documents > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        📄 {appointment.documents}
                      </span>
                    )}
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${appointment.status === 'Pending' ? 'status-pending' : ''}
                      ${appointment.status === 'Confirmed' ? 'status-confirmed' : ''}
                      ${appointment.status === 'Cancelled' ? 'status-cancelled' : ''}
                      ${appointment.status === 'Overdue' ? 'status-overdue' : ''}
                    `}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg bg-primary-50 hover:bg-primary-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-primary-900">View All Appointments</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg bg-success-50 hover:bg-success-100 transition-colors">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-success-600" />
                <span className="font-medium text-success-900">Check Messages</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Appointments This Week</span>
              <span className="font-semibold text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="font-semibold text-success-600">94%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Patient Satisfaction</span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-success-600" />
                <span className="font-semibold text-success-600">4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard