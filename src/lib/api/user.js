import { authFetch, authMutation } from '../core/server';

// All User API - authFetch / authMutation use auto token detect

export const getUserOverview = async (userEmail) => {
  return authFetch(`/api/user/overview?userEmail=${userEmail}`);
};

export const getUserDeliveries = async (userEmail) => {
  return authFetch(`/api/user/deliveries?userEmail=${userEmail}`);
};

export const getUserReadingList = async (userEmail) => {
  return authFetch(`/api/user/reading-list?userEmail=${userEmail}`);
};

export const cancelOrder = async (orderId) => {
  return authMutation(`/api/user/orders/${orderId}/cancel`, null, 'PATCH');
};

export const deleteOrder = async (orderId) => {
  return authMutation(`/api/user/orders/${orderId}`, null, 'DELETE');
};
