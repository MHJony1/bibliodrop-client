import { serverFetch, serverMutation } from "@/lib/core/server";

//admin overview
export const getAdminOverview = async () => {
  return await serverFetch("/api/admin/overview");
};
//admin book approvals
export const getPendingBooks = async () => {
  return await serverFetch("/api/admin/pending-books");
};

//admin actions
export const approveBook = async (bookId) => {
  return await serverMutation(`/api/admin/books/${bookId}/approve`, {}, "PATCH");
};
//delete book
export const adminDeleteBook = async (bookId) => {
  return await serverMutation(`/api/admin/books/${bookId}`, {}, "DELETE");
};

//admin manage users 
//1. get all users
export const getAllUsers = async () => {
  return await serverFetch("/api/admin/users");
};
//2. update user role
export const updateUserRole = async (userId, role) => {
  return await serverMutation(`/api/admin/users/${userId}/role`, { role }, "PATCH");
};
//3. delete user
export const deleteUser = async (userId) => {
  return await serverMutation(`/api/admin/users/${userId}`, {}, "DELETE");
};

//admin manage books
//1. get all books
export const getAllBooks = async () => {
  return await serverFetch("/api/admin/books");
};
//2. toggle book status
export const toggleBookStatus = async (bookId, status) => {
  return await serverMutation(
    `/api/admin/books/${bookId}/toggle`,
    { status },
    "PATCH"
  );
};

//Transactions page
// 1. get all transactions
export const getAllTransactions = async () => {
  return await serverFetch("/api/admin/transactions");
};

// 2. update transaction status
export const updateTransactionStatus = async (transactionId, status) => {
  return await serverMutation(
    `/api/admin/transactions/${transactionId}/status`,
    { status },
    "PATCH"
  );
};