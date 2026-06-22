// lib/api/wishlist.js
import { serverFetch, serverMutation } from '../core/server';

// Get user's wishlist
export const getWishlist = async (userEmail) => {
  return serverFetch(`/api/user/wishlist?userEmail=${userEmail}`);
};

// Add to wishlist
export const addToWishlist = async (userEmail, userId, bookId, bookTitle) => {
  return serverMutation('/api/user/wishlist', {
    userEmail,
    userId,
    bookId,
    bookTitle
  }, 'POST');
};

// Remove from wishlist
export const removeFromWishlist = async (userEmail, bookId) => {
  return serverMutation(`/api/user/wishlist/${bookId}`, { userEmail }, 'DELETE');
};

// Check if in wishlist
export const checkWishlist = async (userEmail, bookId) => {
  return serverFetch(`/api/user/wishlist/check?userEmail=${userEmail}&bookId=${bookId}`);
};