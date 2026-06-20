import React from 'react';
import DashboardLayoutClient from '@/components/dashboardrelated/DashboardLayoutClient';
import { getUserSession } from '@/lib/core/session';

export default async function DashboardRootLayout({ children }) {

  const currentUser = await getUserSession();

  return (
    <DashboardLayoutClient currentUser={currentUser}>
      {children}
    </DashboardLayoutClient>
  );
}
