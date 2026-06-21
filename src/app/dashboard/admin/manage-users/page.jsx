import UserTable from '@/components/dashboardrelated/adminrelated/UserTable';
import { getAllUsers } from '@/lib/api/admin';
import { Users } from 'lucide-react';

const ManageUsersPage = async () => {
  const response = await getAllUsers();
  const users = response?.data || [];

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
          <Users size={18} className="text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white leading-tight">Manage Users</h1>
          <p className="text-slate-500 text-xs mt-0.5">View and manage all platform users.</p>
        </div>
      </div>
      <UserTable users={users} />
    </div>
  );
};

export default ManageUsersPage;