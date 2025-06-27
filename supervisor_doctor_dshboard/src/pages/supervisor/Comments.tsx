import React, { useState } from 'react'
import { MessageCircle, User, Clock, Check, MessageSquare, UserPlus } from 'lucide-react'
import { useData } from '../../contexts/DataContext'
import toast from 'react-hot-toast'

const Comments: React.FC = () => {
  const { comments, doctors, assignDoctorToComment, markCommentResolved, sendMessage } = useData()
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedComment, setSelectedComment] = useState<string | null>(null)
  const [assigningDoctor, setAssigningDoctor] = useState<string | null>(null)

  const filteredComments = comments.filter(comment => 
    statusFilter === 'All' || comment.status === statusFilter
  )

  const handleReply = (comment: any) => {
    sendMessage(comment.patientId, `Thank you for your feedback. We will address your concerns promptly.`)
    toast.success(`Reply sent to ${comment.patientName}`)
  }

  const handleAssignDoctor = (commentId: string, doctorId: string) => {
    assignDoctorToComment(commentId, doctorId)
    setAssigningDoctor(null)
    toast.success('Doctor assigned to comment')
  }

  const handleMarkResolved = (commentId: string) => {
    markCommentResolved(commentId)
    toast.success('Comment marked as resolved')
  }

  const selectedCommentData = comments.find(c => c.id === selectedComment)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Client Comments</h1>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="All">All Comments</option>
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
          </select>
          <div className="text-sm text-gray-600">
            {filteredComments.length} comments
          </div>
        </div>
      </div>

      {/* Comments Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredComments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No comments found</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{comment.patientName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>
                          {new Date(comment.timestamp).toLocaleDateString()} at{' '}
                          {new Date(comment.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Comment Text */}
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                  </div>

                  {/* Tagged Doctor */}
                  {comment.doctorName && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Tagged: {comment.doctorName}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleReply(comment)}
                      className="inline-flex items-center px-3 py-1.5 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 btn-hover"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Reply
                    </button>

                    {!comment.doctorName && (
                      <button
                        onClick={() => setAssigningDoctor(comment.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 btn-hover"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Assign Doctor
                      </button>
                    )}

                    {comment.status === 'Open' && (
                      <button
                        onClick={() => handleMarkResolved(comment.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-success-300 text-sm font-medium rounded-md text-success-700 bg-success-50 hover:bg-success-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 btn-hover"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <span className={`
                    inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${comment.status === 'Open' 
                      ? 'bg-warning-100 text-warning-800' 
                      : 'bg-success-100 text-success-800'
                    }
                  `}>
                    {comment.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assign Doctor Modal */}
      {assigningDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Assign Doctor
                  </h3>
                  <button
                    onClick={() => setAssigningDoctor(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Select a doctor to assign to this comment:
                  </p>
                  
                  <div className="space-y-2">
                    {doctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        onClick={() => handleAssignDoctor(assigningDoctor, doctor.id)}
                        className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doctor.name}</p>
                            <p className="text-sm text-gray-500">{doctor.speciality}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setAssigningDoctor(null)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:w-auto sm:text-sm"
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
              <MessageCircle className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Comments</p>
              <p className="text-2xl font-bold text-gray-900">{comments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Comments</p>
              <p className="text-2xl font-bold text-gray-900">
                {comments.filter(c => c.status === 'Open').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Check className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {comments.filter(c => 
                  c.status === 'Resolved' && 
                  new Date(c.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comments