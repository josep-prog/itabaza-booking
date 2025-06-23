import React from 'react';

const mockPayments = [
  { date: '2024-06-01', amount: 1200 },
  { date: '2024-06-02', amount: 950 },
  { date: '2024-06-03', amount: 1430 },
];

const total = mockPayments.reduce((sum, p) => sum + p.amount, 0);

const AdminPayments = () => (
  <div>
    <h1 className="text-2xl font-bold mb-6">Payments</h1>
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Received</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mockPayments.map((payment, idx) => (
            <tr key={idx}>
              <td className="px-6 py-4 whitespace-nowrap">{payment.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">${payment.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="px-6 py-4 font-bold text-right">Total</td>
            <td className="px-6 py-4 font-bold">${total.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
);

export default AdminPayments; 