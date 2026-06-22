// lib/api/user.js
import { serverFetch, serverMutation } from "../core/server";

// Get User Overview Stats
export const getUserOverview = async (userEmail) => {
  return serverFetch(`/api/user/overview?userEmail=${userEmail}`);
};

// Get User Delivery History
export const getUserDeliveries = async (userEmail) => {
  return serverFetch(`/api/user/deliveries?userEmail=${userEmail}`);
};

// Cancel an order (only works if status is Pending)
export const cancelOrder = async (orderId) => {
  return serverMutation(`/api/user/orders/${orderId}/cancel`, null, 'PATCH');
};

// Delete an order permanently
export const deleteOrder = async (orderId) => {
  return serverMutation(`/api/user/orders/${orderId}`, null, 'DELETE');
};