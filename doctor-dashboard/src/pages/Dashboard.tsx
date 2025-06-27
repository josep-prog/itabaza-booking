import React from 'react';
import { Calendar, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { mockDashboardStats, mockAppointments, mockPayments } from '../data/mockData';

export const Dashboard: React.FC = () => {
  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} RWF`;
  };

  const recentAppointments = mockAppointments.slice(0, 5);
  const recentPayments = mockPayments.slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at iTabaza today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Appointments Today"
          value={mockDashboardStats.appointmentsToday}
          icon={Calendar}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Payments Today"
          value={formatCurrency(mockDashboardStats.paymentsToday)}
          icon={DollarSign}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Failed/Unconfirmed"
          value={mockDashboardStats.failedAppointments}
          icon={AlertTriangle}
          color="yellow"
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard
          title="Completed Today"
          value={mockDashboardStats.completedAppointments}
          icon={CheckCircle}
          color="green"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patientName}</p>
                    <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                    <p className="text-sm text-gray-500">
                      {appointment.appointmentDate} at {appointment.appointmentTime}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : appointment.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{payment.patientName}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-gray-500">TxID: {payment.txId}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};