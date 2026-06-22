// lib/api/user.js
import { serverFetch } from "../core/server";

// Get User Overview Stats
export const getUserOverview = async (userEmail) => {
  return serverFetch(`/api/user/overview?userEmail=${userEmail}`);
};

// Get User Delivery History
export const getUserDeliveries = async (userEmail) => {
  return serverFetch(`/api/user/deliveries?userEmail=${userEmail}`);
};

