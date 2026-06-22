import { authFetch, authMutation } from '@/lib/core/server';

export const getWishlist = (userEmail) =>
  authFetch(`/api/user/wishlist?userEmail=${userEmail}`);

export const addToWishlist = (userEmail, userId, bookId, bookTitle) =>
  authMutation(
    '/api/user/wishlist',
    { userEmail, userId, bookId, bookTitle },
    'POST',
  );

export const removeFromWishlist = (userEmail, bookId) =>
  authMutation(`/api/user/wishlist/${bookId}`, { userEmail }, 'DELETE');

export const checkWishlist = (userEmail, bookId) =>
  authFetch(`/api/user/wishlist/check?userEmail=${userEmail}&bookId=${bookId}`);
