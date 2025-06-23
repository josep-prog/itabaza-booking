import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      // Fetch appointments
      const { data: appts, error: apptError } = await supabase
        .from('appointments')
        .select('*');
      if (apptError) {
        setError('Failed to fetch appointments');
        setLoading(false);
        return;
      }
      // Fetch all involved user IDs
      const userIds = Array.from(new Set([
        ...appts.map((a: any) => a.user_id),
        ...appts.map((a: any) => a.doctor_id),
      ]));
      // Fetch user info
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, full_name');
      if (userError) {
        setError('Failed to fetch user info');
        setLoading(false);
        return;
      }
      // Map user IDs to names
      const userMap: Record<string, string> = {};
      users.forEach((u: any) => {
        userMap[u.id] = u.full_name || u.id;
      });
      // Map appointments to display data
      const displayAppointments = appts.map((a: any) => ({
        doctorName: userMap[a.doctor_id] || a.doctor_id,
        patientName: userMap[a.user_id] || a.user_id,
        time: a.appointment_date,
        type: a.appointment_type,
        status: a.status,
      }));
      setAppointments(displayAppointments);
      setLoading(false);
    };
    fetchAppointments();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Appointments</h1>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appt, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap">{appt.doctorName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appt.patientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appt.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appt.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[appt.status] || 'bg-gray-100 text-gray-700'}`}>
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments; 