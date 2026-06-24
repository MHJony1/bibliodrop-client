import { authFetch, authMutation } from '@/lib/core/server';

// Admin API auto token

// GET requests
export const getAdminOverview = () => authFetch('/api/admin/overview');
export const getPendingBooks = () => authFetch('/api/admin/pending-books');
export const getAllUsers = () => authFetch('/api/admin/users');
export const getAllBooks = () => authFetch('/api/admin/books');
export const getAllTransactions = () => authFetch('/api/admin/transactions');

// POST/PATCH/DELETE requests
export const approveBook = (bookId) =>
  authMutation(`/api/admin/books/${bookId}/approve`, {}, 'PATCH');

export const adminDeleteBook = (bookId) =>
  authMutation(`/api/admin/books/${bookId}`, {}, 'DELETE');

export const updateUserRole = (userId, role) =>
  authMutation(`/api/admin/users/${userId}/role`, { role }, 'PATCH');

export const deleteUser = (userId) =>
  authMutation(`/api/admin/users/${userId}`, {}, 'DELETE');

export const toggleBookStatus = (bookId, status) =>
  authMutation(`/api/admin/books/${bookId}/toggle`, { status }, 'PATCH');

export const updateTransactionStatus = (transactionId, status) =>
  authMutation(
    `/api/admin/transactions/${transactionId}/status`,
    { status },
    'PATCH',
  );

export const blockUser = async (userId, isBlocked) => {
  return await authMutation(
    `/api/admin/users/${userId}/block`,
    { isBlocked },
    "PATCH"
  );
};
