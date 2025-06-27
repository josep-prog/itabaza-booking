import React, { useState } from 'react'
import { Calendar, Filter, Eye, Check, MessageSquare, AlertTriangle } from 'lucide-react'
import { useData } from '../../contexts/DataContext'
import toast from 'react-hot-toast'

const SupervisorAppointments: React.FC = () => {
  const { appointments, doctors, markAppointmentSolved, requestDocs } = useData()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [statusFilter, setStatusFilter] = useState('All')
  const [doctorFilter, setDoctorFilter] = useState('All')
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

  const filteredAppointments = appointments.filter(apt => {
    const dateMatch = apt.date === selectedDate
    const statusMatch = statusFilter === 'All' || apt.status === statusFilter
    const doctorMatch = doctorFilter === 'All' || apt.doctorId === doctorFilter
    return dateMatch && statusMatch && doctorMatch
  })

  const handleMarkSolved = (id: string) => {
    markAppointmentSolved(id)
    toast.success('Appointment marked as solved')
  }

  const handleRequestDocs = (appointmentId: string, doctorId: string) => {
    requestDocs(appointmentId, doctorId)
    toast.success('Document request sent to doctor')
  }

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
        <div className="mt-4 sm:mt-0 text-sm text-gray-600">
          Find & fix unfinished bookings
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <option value="Overdue">Overdue</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="All">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredAppointments.length} appointments
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
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No appointments found for the selected filters</p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {appointment.patient}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        {appointment.doctorName}
                      </button>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointment.issue ? (
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-danger-500 mr-1" />
                          <span className="text-sm text-danger-600 font-medium">
                            {appointment.issue}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
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
                        {appointment.status === 'Overdue' && (
                          <>
                            <button
                              onClick={() => handleMarkSolved(appointment.id)}
                              className="text-success-600 hover:text-success-900 p-1 rounded"
                              title="Mark as Solved"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRequestDocs(appointment.id, appointment.doctorId!)}
                              className="text-warning-600 hover:text-warning-900 p-1 rounded"
                              title="Request Documents"
                            >
                              <MessageSquare className="h-4 w-4" />
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
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Patient</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAppointment.patient}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Doctor</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedAppointment.doctorName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}
                      </p>
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

                  {selectedAppointment.issue && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Issue</label>
                      <p className="mt-1 text-sm text-danger-600 bg-danger-50 p-3 rounded-md">
                        ⚠️ {selectedAppointment.issue}
                      </p>
                    </div>
                  )}

                  {selectedAppointment.patientNote && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Patient Note</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                        {selectedAppointment.patientNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedAppointment.status === 'Overdue' && (
                  <button
                    onClick={() => {
                      handleMarkSolved(selectedAppointment.id)
                      setSelectedAppointment(null)
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-success-600 text-base font-medium text-white hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 sm:ml-3 sm:w-auto sm:text-sm btn-hover"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Solved
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

export default SupervisorAppointments