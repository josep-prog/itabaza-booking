import { FC, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, User, Users, FileText, MessageSquare, DollarSign, BarChart2 } from 'lucide-react';

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

const AdminDashboardLayout: FC<AdminDashboardLayoutProps> = ({ children }) => {
  const location = useLocation();

  const sidebarItems = [
    {
      title: 'Appointments',
      icon: <Calendar className="w-5 h-5" />,
      path: '/admin/appointments'
    },
    {
      title: 'Doctors',
      icon: <User className="w-5 h-5" />,
      path: '/admin/doctors'
    },
    {
      title: 'Supervisors',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/supervisors'
    },
    {
      title: 'Reports',
      icon: <BarChart2 className="w-5 h-5" />,
      path: '/admin/reports'
    },
    {
      title: 'Messages',
      icon: <MessageSquare className="w-5 h-5" />,
      path: '/admin/messages'
    },
    {
      title: 'Payments',
      icon: <DollarSign className="w-5 h-5" />,
      path: '/admin/payments'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-purple-600">Admin Dashboard</h2>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors ${
                location.pathname === item.path
                  ? 'bg-purple-100 text-purple-600 border-r-4 border-purple-600'
                  : 'text-gray-600'
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminDashboardLayout; 