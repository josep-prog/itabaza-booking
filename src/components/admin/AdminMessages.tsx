import React, { useState } from 'react';

const mockStaff = [
  { name: 'Alice Smith', role: 'Nurse', status: 'Online' },
  { name: 'Bob Brown', role: 'Receptionist', status: 'Offline' },
  { name: 'Charlie Green', role: 'Lab Technician', status: 'Online' },
];

const AdminMessages = () => {
  const [selectedStaff, setSelectedStaff] = useState<null | typeof mockStaff[0]>(null);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Staff List */}
      <div className="md:w-1/3">
        <h1 className="text-2xl font-bold mb-6">Staff Members</h1>
        <div className="bg-white rounded shadow divide-y divide-gray-200">
          {mockStaff.map((staff, idx) => (
            <div key={idx} className="flex items-center justify-between px-6 py-4">
              <div>
                <div className="font-semibold">{staff.name}</div>
                <div className="text-xs text-gray-500">{staff.role} • <span className={staff.status === 'Online' ? 'text-green-600' : 'text-gray-400'}>{staff.status}</span></div>
              </div>
              <button
                className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-xs font-semibold hover:bg-purple-200"
                onClick={() => setSelectedStaff(staff)}
              >
                Message
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1">
        {selectedStaff ? (
          <div className="bg-white rounded shadow p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-lg">Chat with {selectedStaff.name}</div>
                <div className="text-xs text-gray-500">{selectedStaff.role}</div>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 text-sm"
                onClick={() => setSelectedStaff(null)}
              >
                Close
              </button>
            </div>
            <div className="text-gray-400 italic">(Chat UI coming soon...)</div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 italic">Select a staff member to start messaging.</div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages; 