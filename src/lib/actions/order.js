"use server";

import { updateOrderStatus } from "@/lib/api/books";
import { revalidatePath } from "next/cache";

export const handleUpdateOrderStatusAction = async (orderId, newStatus) => {
  try {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result?.success) {
      revalidatePath("/dashboard/librarian/manage-deliveries");
      return { success: true };
    }
    return { success: false, error: result?.message };
  } catch (error) {
    return { success: false, error: error.message };
  }
};