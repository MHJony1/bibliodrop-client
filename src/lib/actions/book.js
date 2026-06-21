"use server"; 

import { createBook, deleteBook, updateBookStatus, updateBook } from "@/lib/api/books";
import { revalidatePath } from "next/cache";
import { getUserSession } from "../core/session";

export async function handleAddBookAction(finalBookData) {
  try {
    const user = await getUserSession();
    const bookWithLibrarian = {
      ...finalBookData,
      librarianEmail: user?.email || "unknown@gmail.com",
      librarianName: user?.name || "Librarian", 
      userId: user?.id || user?._id || null
    };
    const result = await createBook(bookWithLibrarian);

    if (result && result.success) {
      revalidatePath("/dashboard/librarian");
      revalidatePath("/dashboard/librarian/manage-inventory");
      return { success: true, message: result.message };
    } else {
      return { success: false, error: result?.message || "Failed to save data on backend." };
    }
  } catch (error) {
    console.error("Server Action Error:", error);
    return { success: false, error: error.message };
  }
}

export const handleDeleteBookAction = async (bookId) => {
  try {
    const result = await deleteBook(bookId);
    if (result?.success) {
      revalidatePath("/dashboard/librarian/manage-inventory");
      return { success: true };
    }
    return { success: false, error: result?.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const handleToggleBookStatusAction = async (bookId, currentStatus) => {
  try {
    const newStatus = currentStatus === 'Published' ? 'Unpublished' : 'Published';
    const result = await updateBookStatus(bookId, newStatus);
    if (result?.success) {
      revalidatePath("/dashboard/librarian/manage-inventory");
      return { success: true, newStatus };
    }
    return { success: false, error: result?.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const handleEditBookAction = async (bookId, formData) => {
  try {
    const result = await updateBook(bookId, formData);
    if (result?.success) {
      revalidatePath("/dashboard/librarian/manage-inventory");
      return { success: true };
    }
    return { success: false, error: result?.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};