import React from 'react';

const mockReports = [
  {
    doctorName: 'Dr. John Doe',
    issue: 'Late to appointments',
    supervisorName: 'Sarah Johnson',
    documentUrl: '#',
  },
  {
    doctorName: 'Dr. Jane Lee',
    issue: 'Incomplete patient records',
    supervisorName: 'Michael Brown',
    documentUrl: '#',
  },
  {
    doctorName: 'Dr. Sam Smith',
    issue: 'Unprofessional behavior',
    supervisorName: 'Emily Davis',
    documentUrl: '#',
  },
];

const AdminReports = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Reports</h1>
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporting Document</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mockReports.map((report, idx) => (
            <tr key={idx}>
              <td className="px-6 py-4 whitespace-nowrap">{report.doctorName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{report.issue}</td>
              <td className="px-6 py-4 whitespace-nowrap">{report.supervisorName}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a
                  href={report.documentUrl}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminReports; 