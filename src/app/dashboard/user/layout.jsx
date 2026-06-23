import { requireRole } from '@/lib/core/session';
import React from 'react';

export const metadata = {
  title: "User Dashboard | BiblioDrop",
  description: "Manage your BiblioDrop user account and activities.",
};


const UserLayout = async ({ children }) => {
    await requireRole('user');
    return children;
};

export default UserLayout;