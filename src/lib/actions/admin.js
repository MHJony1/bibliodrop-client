"use server";

import { revalidatePath } from "next/cache";
import { approveBook, adminDeleteBook, updateUserRole, deleteUser, getAllBooks, toggleBookStatus, getAllTransactions, updateTransactionStatus } from "@/lib/api/admin";

//1. approve book action (book-approvals)
export const handleApproveBookAction = async (bookId) => {
  try {
    const result = await approveBook(bookId);
    if (result?.success) {
      revalidatePath("/dashboard/admin/book-approvals");
      revalidatePath("/dashboard/admin");
      return { success: true, message: result.message };
    }
    return { success: false, error: result?.message || "Failed to approve the book." };
  } catch (error) {
    console.error("Admin Action Error (Approve Book):", error);
    return { success: false, error: error.message };
  }
};

//2. delete book action (book-approvals)
export const handleAdminDeleteBookAction = async (bookId) => {
  try {
    const result = await adminDeleteBook(bookId);
    if (result?.success) {
      revalidatePath("/dashboard/admin/book-approvals");
      revalidatePath("/dashboard/admin");
      return { success: true };
    }
    return { success: false, error: result?.message || "Failed to delete the book." };
  } catch (error) {
    console.error("Admin Action Error (Delete Book):", error);
    return { success: false, error: error.message };
  }
};

//3. update user role action(manage-users)
export const handleUpdateUserRoleAction = async (userId, newRole) => {
  try {
    const result = await updateUserRole(userId, newRole);
    if (result?.success) {
      revalidatePath("/dashboard/admin/manage-users");
      return { success: true };
    }
    return { success: false, error: result?.message || "Failed to update user role." };
  } catch (error) {
    console.error("Admin Action Error (Update Role):", error);
    return { success: false, error: error.message };
  }
};

//4. delete user (manage-users)
export const handleDeleteUserAction = async (userId) => {
  try {
    const result = await deleteUser(userId); 
    if (result?.success) {
      revalidatePath("/dashboard/admin/manage-users");
      return { success: true };
    }
    return { success: false, error: result?.message || "Failed to delete user." };
  } catch (error) {
    console.error("Admin Action Error (Delete User):", error);
    return { success: false, error: error.message };
  }
};

//5. fetch all books(manage-books)
export const fetchAllBooksAction = async () => {
  try {
    const result = await getAllBooks();
    if (result?.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result?.message || "Failed to fetch books" };
  } catch (error) {
    console.error("Fetch Books Error:", error);
    return { success: false, error: error.message };
  }
};

//6. toggle book status(manage-books)
export const handleToggleBookStatusAction = async (bookId, status) => {
  try {
    const result = await toggleBookStatus(bookId, status);
    if (result?.success) {
      revalidatePath("/dashboard/admin/manage-books");
      return { success: true };
    }
    return { success: false, error: result?.message || "Failed to update status" };
  } catch (error) {
    console.error("Toggle Status Error:", error);
    return { success: false, error: error.message };
  }
};

// 1. fetch all transactions
export const fetchAllTransactionsAction = async () => {
  try {
    const result = await getAllTransactions();
    if (result?.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result?.message || "Failed to fetch transactions" };
  } catch (error) {
    console.error("Fetch Transactions Error:", error);
    return { success: false, error: error.message };
  }
};

// 2. update transaction status
export const handleUpdateTransactionStatusAction = async (transactionId, status) => {
  try {
    const result = await updateTransactionStatus(transactionId, status);
    if (result?.success) {
      revalidatePath("/dashboard/admin/transactions");
      return { success: true, message: result.message };
    }
    return { success: false, error: result?.message || "Failed to update status" };
  } catch (error) {
    console.error("Update Transaction Status Error:", error);
    return { success: false, error: error.message };
  }
};