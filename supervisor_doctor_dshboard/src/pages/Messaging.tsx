import React, { useState } from 'react'
import { Send, Paperclip, Search, Users, UserCheck, Shield } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const Messaging: React.FC = () => {
  const { contacts, messages, sendMessage, markMessageAsRead } = useData()
  const { user } = useAuth()
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [activeTab, setActiveTab] = useState<'patients' | 'doctors' | 'admin'>('patients')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredContacts = contacts
    .filter(contact => contact.type === activeTab.slice(0, -1) as any)
    .filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const selectedContactData = contacts.find(c => c.id === selectedContact)
  
  const conversationMessages = messages.filter(msg => 
    (msg.senderId === selectedContact && msg.receiverId === user?.id) ||
    (msg.senderId === user?.id && msg.receiverId === selectedContact)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedContact) return

    sendMessage(selectedContact, messageText)
    setMessageText('')
    toast.success('Message sent')
  }

  const handleContactSelect = (contactId: string) => {
    setSelectedContact(contactId)
    // Mark messages as read
    const unreadMessages = messages.filter(msg => 
      msg.senderId === contactId && msg.receiverId === user?.id && !msg.isRead
    )
    unreadMessages.forEach(msg => markMessageAsRead(msg.id))
  }

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'patients': return Users
      case 'doctors': return UserCheck
      case 'admin': return Shield
      default: return Users
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200 flex">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {(['patients', 'doctors', 'admin'] as const).map((tab) => {
            const Icon = getTabIcon(tab)
            const tabContacts = contacts.filter(c => c.type === tab.slice(0, -1) as any)
            const unreadCount = tabContacts.reduce((sum, c) => sum + c.unreadCount, 0)
            
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 px-4 py-3 text-sm font-medium capitalize relative
                  ${activeTab === tab 
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{tab}</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-danger-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No contacts found</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleContactSelect(contact.id)}
                  className={`
                    w-full text-left p-3 rounded-lg transition-colors
                    ${selectedContact === contact.id 
                      ? 'bg-primary-50 border border-primary-200' 
                      : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {contact.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {contact.name}
                          </p>
                          {contact.lastMessage && (
                            <p className="text-xs text-gray-500 truncate">
                              {contact.lastMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {contact.lastMessageTime && (
                        <span className="text-xs text-gray-400">
                          {contact.lastMessageTime}
                        </span>
                      )}
                      {contact.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-danger-500 rounded-full">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600">
                    {selectedContactData?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedContactData?.name}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {selectedContactData?.type}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {conversationMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-xs lg:max-w-md px-4 py-2 rounded-lg
                        ${message.senderId === user?.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                        }
                      `}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`
                        text-xs mt-1
                        ${message.senderId === user?.id ? 'text-primary-100' : 'text-gray-500'}
                      `}>
                        {new Date(message.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md">
                  <Paperclip className="h-5 w-5" />
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed btn-hover"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a contact from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messaging