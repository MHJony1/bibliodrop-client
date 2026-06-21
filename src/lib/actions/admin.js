"use server";

import { revalidatePath } from "next/cache";
import { approveBook, adminDeleteBook, updateUserRole } from "@/lib/api/admin";

/**
 * Handle server action for approving and publishing a pending book listing
 */
export const handleApproveBookAction = async (bookId) => {
  try {
    const result = await approveBook(bookId);
    if (result?.success) {
      revalidatePath("/dashboard/admin");
      return { success: true, message: result.message };
    }
    return { success: false, error: result?.message || "Failed to approve the book." };
  } catch (error) {
    console.error("Admin Action Error (Approve Book):", error);
    return { success: false, error: error.message };
  }
};

/**
 * Handle server action for permanent deletion of a book by administration
 */
export const handleAdminDeleteBookAction = async (bookId) => {
  try {
    const result = await adminDeleteBook(bookId);
    if (result?.success) {
      revalidatePath("/dashboard/admin");
      return { success: true };
    }
    return { success: false, error: result?.message || "Failed to delete the book." };
  } catch (error) {
    console.error("Admin Action Error (Delete Book):", error);
    return { success: false, error: error.message };
  }
};

/**
 * Handle server action for modifying a user's operational role status
 */
export const handleUpdateUserRoleAction = async (userId, newRole) => {
  try {
    const result = await updateUserRole(userId, newRole);
    if (result?.success) {
      revalidatePath("/dashboard/admin");
      return { success: true };
    }
    return { success: false, error: result?.message || "Failed to update user role." };
  } catch (error) {
    console.error("Admin Action Error (Update Role):", error);
    return { success: false, error: error.message };
  }
};