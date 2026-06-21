import { serverFetch, serverMutation } from "@/lib/core/server";


// Fetch total metrics and category breakdown for the admin overview dashboard

export const getAdminOverview = async () => {
  return await serverFetch("/api/admin/overview");
};


// Fetch all book submissions that are currently pending system approval
 
export const getPendingBooks = async () => {
  return await serverFetch("/api/admin/pending-books");
};


 // Approve a specific book submission and publish it platform-wide
 
export const approveBook = async (bookId) => {
  return await serverMutation(`/api/admin/books/${bookId}/approve`, {}, "PATCH");
};


 // Fetch a complete list of all registered users on the platform
 
export const getAllUsers = async () => {
  return await serverFetch("/api/admin/users");
};


 // Update the access role of a specific user (e.g., admin, librarian)
 
export const updateUserRole = async (userId, role) => {
  return await serverMutation(`/api/admin/users/${userId}/role`, { role }, "PATCH");
};


 // Forcibly remove and permanently delete any book listing from the platform
 
export const adminDeleteBook = async (bookId) => {
  return await serverMutation(`/api/admin/books/${bookId}`, {}, "DELETE");
};