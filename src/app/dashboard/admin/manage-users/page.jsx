import UserTable from '@/components/dashboardrelated/adminrelated/UserTable';
import { getAllUsers } from '@/lib/api/admin';
import { Users, Shield, UserCog, Library, RefreshCw } from 'lucide-react';

const ManageUsersPage = async () => {
  const response = await getAllUsers();
  const users = response?.data || [];

  // Calculate stats
  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalLibrarians = users.filter((u) => u.role === 'librarian').length;
  const totalUsers = users.filter((u) => u.role === 'user').length;

  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: users.length,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      icon: Library,
      label: 'Librarians',
      value: totalLibrarians,
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      iconColor: 'text-purple-400',
    },
    {
      icon: Shield,
      label: 'Admins',
      value: totalAdmins,
      color: 'from-violet-500 to-violet-600',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      iconColor: 'text-violet-400',
    },
    {
      icon: UserCog,
      label: 'Active Roles',
      value: '3',
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 backdrop-blur-sm">
              <Users size={22} className="text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Manage Users
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                View and manage all platform users. ({users.length} total)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 inline-block rounded-full bg-emerald-400 animate-pulse mr-2" />
              All systems operational
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`p-5 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-800/30 border ${stat.border} backdrop-blur-sm hover:border-white/10 transition-all duration-300 group`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon size={18} className={stat.iconColor} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white mt-0.5">
                  {typeof stat.value === 'number' ? stat.value : stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Table */}
      <UserTable users={users} />
    </div>
  );
};

export default ManageUsersPage;
