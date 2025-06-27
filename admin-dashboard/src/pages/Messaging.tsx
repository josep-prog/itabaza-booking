import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, User } from 'lucide-react';
import { mockMessages, mockDoctors, mockSupervisors } from '../data/mockData';
import { Message, User as UserType } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const Messaging: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const allStaff = [...mockDoctors, ...mockSupervisors];
  
  const filteredStaff = allStaff.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getConversationWith = (staffId: string) => {
    return messages.filter(msg => 
      (msg.senderId === user?.id && msg.receiverId === staffId) ||
      (msg.senderId === staffId && msg.receiverId === user?.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const getUnreadCount = (staffId: string) => {
    return messages.filter(msg => 
      msg.senderId === staffId && 
      msg.receiverId === user?.id && 
      !msg.read
    ).length;
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      receiverId: selectedUser.id,
      receiverName: selectedUser.name,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const markAsRead = (staffId: string) => {
    setMessages(messages.map(msg => 
      msg.senderId === staffId && msg.receiverId === user?.id
        ? { ...msg, read: true }
        : msg
    ));
  };

  useEffect(() => {
    if (selectedUser) {
      markAsRead(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messaging</h1>
        <p className="text-gray-600">Communicate with doctors and supervisors.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[600px] flex">
        {/* Staff List */}
        <div className="w-1/3 border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredStaff.map((staff) => {
              const unreadCount = getUnreadCount(staff.id);
              const lastMessage = getConversationWith(staff.id).slice(-1)[0];
              
              return (
                <div
                  key={staff.id}
                  onClick={() => setSelectedUser(staff)}
                  className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedUser?.id === staff.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{staff.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{staff.role}</p>
                        {lastMessage && (
                          <p className="text-xs text-gray-600 truncate w-32">
                            {lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{unreadCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedUser.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{selectedUser.role}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {getConversationWith(selectedUser.id).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select a staff member to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};