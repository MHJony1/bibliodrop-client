import { requireRole } from '@/lib/core/session';
import React from 'react';

const LibrarianLayout = async ({ children }) => {
    await requireRole('librarian');
    return children;
};

export default LibrarianLayout;