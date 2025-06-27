import React from 'react'
import { AlertTriangle, MessageSquare, Phone, MessageCircle } from 'lucide-react'
import { useData } from '../../contexts/DataContext'

const SupervisorDashboard: React.FC = () => {
  const { stats, appointments, comments, supportSMS } = useData()

  const cards = [
    {
      title: 'Failed Appointments',
      value: stats.failedAppointments,
      description: 'Bookings past their time but still unconfirmed',
      icon: AlertTriangle,
      color: stats.failedAppointments > 0 ? 'danger' : 'gray',
      bgColor: stats.failedAppointments > 0 ? 'bg-danger-50' : 'bg-gray-50',
      iconColor: stats.failedAppointments > 0 ? 'text-danger-600' : 'text-gray-600',
      textColor: stats.failedAppointments > 0 ? 'text-danger-900' : 'text-gray-900',
      pulse: stats.failedAppointments > 0
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      description: 'Messages waiting for response',
      icon: MessageSquare,
      color: stats.unreadMessages > 0 ? 'primary' : 'gray',
      bgColor: stats.unreadMessages > 0 ? 'bg-primary-50' : 'bg-gray-50',
      iconColor: stats.unreadMessages > 0 ? 'text-primary-600' : 'text-gray-600',
      textColor: stats.unreadMessages > 0 ? 'text-primary-900' : 'text-gray-900'
    },
    {
      title: 'Open Support Requests',
      value: stats.openSupportRequests,
      description: 'SMS or tickets marked "open"',
      icon: Phone,
      color: stats.openSupportRequests > 0 ? 'warning' : 'gray',
      bgColor: stats.openSupportRequests > 0 ? 'bg-warning-50' : 'bg-gray-50',
      iconColor: stats.openSupportRequests > 0 ? 'text-warning-600' : 'text-gray-600',
      textColor: stats.openSupportRequests > 0 ? 'text-warning-900' : 'text-gray-900'
    },
    {
      title: 'New Client Comments',
      value: stats.newClientComments,
      description: 'Comments added today',
      icon: MessageCircle,
      color: stats.newClientComments > 0 ? 'success' : 'gray',
      bgColor: stats.newClientComments > 0 ? 'bg-success-50' : 'bg-gray-50',
      iconColor: stats.newClientComments > 0 ? 'text-success-600' : 'text-gray-600',
      textColor: stats.newClientComments > 0 ? 'text-success-900' : 'text-gray-900'
    }
  ]

  const recentFailedAppointments = appointments
    .filter(apt => apt.status === 'Overdue')
    .slice(0, 5)

  const recentComments = comments
    .filter(comment => comment.status === 'Open')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3)

  const recentSupportRequests = supportSMS
    .filter(sms => sms.status === 'Open')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Supervisor Dashboard</h1>
        <p className="text-primary-100">
          Monitor system performance and resolve issues across the platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Failed Appointments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Failed Appointments</h2>
          </div>
          <div className="p-6">
            {recentFailedAppointments.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No failed appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentFailedAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-danger-50 rounded-lg border border-danger-200"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {appointment.patient}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {appointment.doctorName} • {appointment.time}
                      </p>
                      <p className="text-xs text-danger-600 font-medium">
                        Issue: {appointment.issue}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
                      Overdue
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Client Comments</h2>
          </div>
          <div className="p-6">
            {recentComments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent comments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {comment.patientName}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {comment.text.length > 100 
                        ? `${comment.text.substring(0, 100)}...` 
                        : comment.text
                      }
                    </p>
                    {comment.doctorName && (
                      <p className="text-xs text-blue-600">
                        Tagged: {comment.doctorName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Support Requests */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Support Requests</h2>
        </div>
        <div className="p-6">
          {recentSupportRequests.length === 0 ? (
            <div className="text-center py-8">
              <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent support requests</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentSupportRequests.map((sms) => (
                <div
                  key={sms.id}
                  className="p-4 bg-warning-50 rounded-lg border border-warning-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {sms.senderName || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">{sms.phone}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(sms.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {sms.body.length > 80 
                      ? `${sms.body.substring(0, 80)}...` 
                      : sms.body
                    }
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SupervisorDashboard