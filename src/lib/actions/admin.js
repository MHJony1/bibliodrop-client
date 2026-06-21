"use server";

import { revalidatePath } from "next/cache";
import { approveBook, adminDeleteBook, updateUserRole } from "@/lib/api/admin";

export const handleApproveBookAction = async (bookId) => {
  try {
    const result = await approveBook(bookId);
    if (result?.success) {
      revalidatePath("/dashboard/admin/book-approvals"); // ✅ Correct path
      revalidatePath("/dashboard/admin");
      return { success: true, message: result.message };
    }
    return { success: false, error: result?.message || "Failed to approve the book." };
  } catch (error) {
    console.error("Admin Action Error (Approve Book):", error);
    return { success: false, error: error.message };
  }
};

export const handleAdminDeleteBookAction = async (bookId) => {
  try {
    const result = await adminDeleteBook(bookId);
    if (result?.success) {
      revalidatePath("/dashboard/admin/book-approvals"); // ✅ Correct path
      revalidatePath("/dashboard/admin");
      return { success: true };
    }
    return { success: false, error: result?.message || "Failed to delete the book." };
  } catch (error) {
    console.error("Admin Action Error (Delete Book):", error);
    return { success: false, error: error.message };
  }
};

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