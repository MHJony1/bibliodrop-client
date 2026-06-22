// lib/api/reviews.js
import { serverFetch, serverMutation } from '../core/server';

// Get all reviews for a book
export const getBookReviews = async (bookId) => {
  return serverFetch(`/api/books/${bookId}/reviews`);
};

// Add a review
export const addReview = async (bookId, reviewData) => {
  return serverMutation(`/api/books/${bookId}/reviews`, reviewData, 'POST');
};

// Update a review
export const updateReview = async (reviewId, reviewData) => {
  return serverMutation(`/api/reviews/${reviewId}`, reviewData, 'PATCH');
};

// Delete a review
export const deleteReview = async (reviewId, userEmail) => {
  return serverMutation(`/api/reviews/${reviewId}`, { userEmail }, 'DELETE');
};

// Get user's all reviews
export const getUserReviews = async (userEmail) => {
  return serverFetch(`/api/user/reviews?userEmail=${userEmail}`);
};