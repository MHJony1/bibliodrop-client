import { requireRole } from '@/lib/core/session';
import React from 'react';

export const metadata = {
  title: " Librarian Dashboard | BiblioDrop",
  description: "Manage your BiblioDro Librarian account and activities.",
};


const LibrarianLayout = async ({ children }) => {
    await requireRole('librarian');
    return children;
};

export default LibrarianLayout;