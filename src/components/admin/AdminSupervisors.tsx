import React from 'react';

const mockSupervisors = [
  {
    name: 'Sarah Johnson',
    reports: 12,
    engagement: 88,
  },
  {
    name: 'Michael Brown',
    reports: 7,
    engagement: 75,
  },
  {
    name: 'Emily Davis',
    reports: 15,
    engagement: 93,
  },
];

const AdminSupervisors = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Supervisors</h1>
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of Reports</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement (%)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Performance Tracking</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mockSupervisors.map((sup, idx) => (
            <tr key={idx}>
              <td className="px-6 py-4 whitespace-nowrap">{sup.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{sup.reports}</td>
              <td className="px-6 py-4 whitespace-nowrap">{sup.engagement}%</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-xs font-semibold hover:bg-purple-200">Track</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminSupervisors; 