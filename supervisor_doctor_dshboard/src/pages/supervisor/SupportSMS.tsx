import React, { useState } from 'react'
import { Phone, MessageSquare, Clock, X, Send } from 'lucide-react'
import { useData } from '../../contexts/DataContext'
import toast from 'react-hot-toast'

const SupportSMS: React.FC = () => {
  const { supportSMS, closeSupportTicket, sendMessage } = useData()
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedSMS, setSelectedSMS] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

  const filteredSMS = supportSMS.filter(sms => 
    statusFilter === 'All' || sms.status === statusFilter
  )

  const handleCloseTicket = (smsId: string) => {
    closeSupportTicket(smsId)
    toast.success('Support ticket closed')
  }

  const handleReply = (sms: any) => {
    if (!replyText.trim()) return

    // In a real app, this would send SMS via gateway
    // For now, we'll simulate sending a message if the sender is a registered user
    if (sms.senderName) {
      sendMessage('patient-id', replyText) // In real app, would map phone to user ID
      toast.success(`Reply sent to ${sms.senderName}`)
    } else {
      toast.success(`SMS reply sent to ${sms.phone}`)
    }
    
    setReplyText('')
    setSelectedSMS(null)
  }

  const selectedSMSData = supportSMS.find(s => s.id === selectedSMS)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Support SMS</h1>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="All">All Requests</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
          <div className="text-sm text-gray-600">
            {filteredSMS.length} requests
          </div>
        </div>
      </div>

      {/* SMS Feed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">SMS Support Requests</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredSMS.length === 0 ? (
            <div className="p-12 text-center">
              <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No support requests found</p>
            </div>
          ) : (
            filteredSMS.map((sms) => (
              <div
                key={sms.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-warning-100 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-warning-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">
                            {sms.senderName || 'Unknown Sender'}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {sms.phone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(sms.timestamp).toLocaleDateString()} at{' '}
                            {new Date(sms.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="mb-4">
                      <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-md">
                        {sms.body}
                      </p>
                    </div>

                    {/* Actions */}
                    {sms.status === 'Open' && (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setSelectedSMS(sms.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 btn-hover"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Reply
                        </button>

                        <button
                          onClick={() => handleCloseTicket(sms.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 btn-hover"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Close Ticket
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <span className={`
                      inline-flex px-2 py-1 text-xs font-semibold rounded-full
                      ${sms.status === 'Open' 
                        ? 'bg-warning-100 text-warning-800' 
                        : 'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {sms.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {selectedSMS && selectedSMSData && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Reply to Support Request
                  </h3>
                  <button
                    onClick={() => setSelectedSMS(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Original Message */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {selectedSMSData.senderName || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedSMSData.phone}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">
                    {selectedSMSData.body}
                  </p>
                </div>

                {/* Reply Input */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Reply
                    </label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Type your reply..."
                    />
                  </div>

                  <div className="text-sm text-gray-500">
                    {selectedSMSData.senderName 
                      ? 'This will be sent as a message to the registered user.'
                      : 'This will be sent as an SMS to the phone number.'}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => handleReply(selectedSMSData)}
                  disabled={!replyText.trim()}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm btn-hover"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </button>
                <button
                  onClick={() => setSelectedSMS(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Phone className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{supportSMS.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {supportSMS.filter(s => s.status === 'Open').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <X className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Closed Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {supportSMS.filter(s => 
                  s.status === 'Closed' && 
                  new Date(s.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportSMS