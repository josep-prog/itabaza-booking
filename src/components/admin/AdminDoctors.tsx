import React, { useState } from 'react';

const mockDoctors = [
  {
    name: 'Dr. John Doe',
    category: 'Cardiology',
    description: 'Heart specialist',
    performance: 92,
  },
  {
    name: 'Dr. Jane Lee',
    category: 'Dermatology',
    description: 'Skin and hair expert',
    performance: 87,
  },
  {
    name: 'Dr. Sam Smith',
    category: 'Pediatrics',
    description: 'Child health',
    performance: 95,
  },
];

const AdminDoctors = () => {
  const [showModal, setShowModal] = useState(false);
  const [doctors, setDoctors] = useState(mockDoctors);

  const handleRemove = (index: number) => {
    setDoctors(doctors.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Doctors</h1>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={() => setShowModal(true)}
        >
          + Add Doctor
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance (%)</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctors.map((doc, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap">{doc.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doc.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doc.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{doc.performance}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    className="text-red-600 hover:underline text-sm"
                    onClick={() => handleRemove(idx)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add Doctor Modal (placeholder) */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Doctor</h2>
            <p className="mb-4 text-gray-500">(Form to add doctor coming soon...)</p>
            <button
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors; 