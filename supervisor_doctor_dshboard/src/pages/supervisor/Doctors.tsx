import React, { useState } from 'react'
import { Users, AlertTriangle, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react'
import { useData } from '../../contexts/DataContext'
import toast from 'react-hot-toast'

const Doctors: React.FC = () => {
  const { doctors, appointments, sendMessage } = useData()
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)

  const handleMessageDoctor = (doctorId: string, doctorName: string) => {
    sendMessage(doctorId, `Hello ${doctorName}, please review your recent appointments and address any pending issues.`)
    toast.success(`Message sent to ${doctorName}`)
  }

  const getDoctorFailedAppointments = (doctorId: string) => {
    return appointments.filter(apt => apt.doctorId === doctorId && apt.status === 'Overdue')
  }

  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor)
  const selectedDoctorFailedAppointments = selectedDoctor ? getDoctorFailedAppointments(selectedDoctor) : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Performance</h1>
        <div className="mt-4 sm:mt-0 text-sm text-gray-600">
          Monitor doctor stats & resolve failed appointments
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Daily Performance Overview</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Speciality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Appointments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Failed Today
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-primary-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {doctor.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{doctor.speciality}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{doctor.totalAppointments}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedDoctor(doctor.id)}
                      className={`
                        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${doctor.failedToday > 0 
                          ? 'bg-danger-100 text-danger-800 hover:bg-danger-200' 
                          : 'bg-success-100 text-success-800'
                        }
                      `}
                    >
                      {doctor.failedToday > 0 && <AlertTriangle className="h-4 w-4 mr-1" />}
                      {doctor.failedToday}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {doctor.completionRate >= 90 ? (
                        <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-danger-500 mr-1" />
                      )}
                      <span className={`
                        text-sm font-medium
                        ${doctor.completionRate >= 90 ? 'text-success-600' : 'text-danger-600'}
                      `}>
                        {doctor.completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleMessageDoctor(doctor.id, doctor.name)}
                      className="inline-flex items-center px-3 py-1.5 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 btn-hover"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message Doctor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Failed Appointments Modal */}
      {selectedDoctor && selectedDoctorData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Failed Appointments - {selectedDoctorData.name}
                  </h3>
                  <button
                    onClick={() => setSelectedDoctor(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Doctor Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedDoctorData.name}</h4>
                      <p className="text-sm text-gray-600">{selectedDoctorData.speciality}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          Total: {selectedDoctorData.totalAppointments} appointments
                        </span>
                        <span className="text-xs text-gray-500">
                          Rate: {selectedDoctorData.completionRate}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Failed Appointments List */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Failed Appointments Today</h4>
                  {selectedDoctorFailedAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No failed appointments</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDoctorFailedAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="p-4 bg-danger-50 rounded-lg border border-danger-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {appointment.patient}
                              </h5>
                              <p className="text-sm text-gray-600 mt-1">
                                {appointment.reason}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-gray-500">
                                  {appointment.time}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {appointment.type}
                                </span>
                                {appointment.issue && (
                                  <span className="text-xs text-danger-600 font-medium">
                                    Issue: {appointment.issue}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
                              Overdue
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => {
                    handleMessageDoctor(selectedDoctorData.id, selectedDoctorData.name)
                    setSelectedDoctor(null)
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm btn-hover"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Doctor
                </button>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Performer</p>
              <p className="text-lg font-semibold text-gray-900">
                {doctors.reduce((prev, current) => 
                  prev.completionRate > current.completionRate ? prev : current
                ).name}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Failed Today</p>
              <p className="text-lg font-semibold text-gray-900">
                {doctors.reduce((sum, doctor) => sum + doctor.failedToday, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Completion</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.round(doctors.reduce((sum, doctor) => sum + doctor.completionRate, 0) / doctors.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Doctors