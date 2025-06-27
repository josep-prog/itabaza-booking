import React, { useState } from 'react'
import { Calendar, Filter, Eye, Check, X, Video, FileText, Clock } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const Appointments: React.FC = () => {
  const { appointments, updateAppointmentStatus } = useData()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

  const filteredAppointments = appointments.filter(apt => {
    const dateMatch = apt.date === selectedDate
    const statusMatch = statusFilter === 'All' || apt.status === statusFilter
    return dateMatch && statusMatch
  })

  const handleConfirm = (id: string) => {
    updateAppointmentStatus(id, 'Confirmed')
    toast.success('Appointment confirmed successfully')
  }

  const handleReject = (id: string) => {
    updateAppointmentStatus(id, 'Cancelled')
    toast.success('Appointment cancelled')
  }

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
  }

  const startVideoCall = () => {
    toast.success('Starting video call...')
    // In a real app, this would integrate with a video calling service
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments found for the selected date and status</p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {appointment.time}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {appointment.type === 'Video' ? (
                          <Video className="h-4 w-4 text-blue-500 mr-2" />
                        ) : (
                          <div className="h-4 w-4 bg-green-500 rounded-full mr-2" />
                        )}
                        <span className="text-sm text-gray-900">{appointment.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {appointment.patient}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900 mr-2">
                          {appointment.reason}
                        </span>
                        {appointment.videoNote && (
                          <Video className="h-4 w-4 text-blue-500" title="Has video note" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointment.documents > 0 ? (
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="text-sm text-blue-600 font-medium">
                            {appointment.documents}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${appointment.status === 'Pending' ? 'status-pending' : ''}
                        ${appointment.status === 'Confirmed' ? 'status-confirmed' : ''}
                        ${appointment.status === 'Cancelled' ? 'status-cancelled' : ''}
                        ${appointment.status === 'Overdue' ? 'status-overdue' : ''}
                      `}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className="text-primary-600 hover:text-primary-900 p-1 rounded"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {appointment.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleConfirm(appointment.id)}
                              className="text-success-600 hover:text-success-900 p-1 rounded"
                              title="Confirm"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(appointment.id)}
                              className="text-danger-600 hover:text-danger-900 p-1 rounded"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Appointment Details
                  </h3>
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Patient</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAppointment.patient}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Time</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAppointment.time}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAppointment.type}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reason</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedAppointment.reason}</p>
                  </div>

                  {selectedAppointment.patientNote && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Patient Note</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                        {selectedAppointment.patientNote}
                      </p>
                    </div>
                  )}

                  {selectedAppointment.videoNote && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Video Note</label>
                      <p className="mt-1 text-sm text-gray-900 bg-blue-50 p-3 rounded-md">
                        📹 {selectedAppointment.videoNote}
                      </p>
                    </div>
                  )}

                  {selectedAppointment.files && selectedAppointment.files.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Uploaded Files</label>
                      <div className="mt-1 space-y-2">
                        {selectedAppointment.files.map((file: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-blue-600">
                            <FileText className="h-4 w-4" />
                            <span>Document {index + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedAppointment.type === 'Video' && selectedAppointment.status === 'Confirmed' && (
                  <button
                    onClick={startVideoCall}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm btn-hover"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Start Video Call
                  </button>
                )}
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments