import { serverFetch, authFetch, authMutation } from '@/lib/core/server';

//  Public
export const getBookReviews = (bookId) =>
  serverFetch(`/api/books/${bookId}/reviews`);

// ✅ Protected
export const addReview = (bookId, reviewData) =>
  authMutation(`/api/books/${bookId}/reviews`, reviewData, 'POST');

export const updateReview = (reviewId, reviewData) =>
  authMutation(`/api/reviews/${reviewId}`, reviewData, 'PATCH');

export const deleteReview = (reviewId, userEmail) =>
  authMutation(`/api/reviews/${reviewId}`, { userEmail }, 'DELETE');

export const getUserReviews = (userEmail) =>
  authFetch(`/api/user/reviews?userEmail=${userEmail}`);
