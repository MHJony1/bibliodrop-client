import { requireRole } from '@/lib/core/session';
import React from 'react';

export const metadata = {
  title: "Admin Dashboard | BiblioDrop",
  description: "Manage your BiblioDrop admin account and activities.",
};


const AdminLayout = async ({ children }) => {
    await requireRole('admin');
    return children;
};

export default AdminLayout;