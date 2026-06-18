import { serverFetch } from "../core/server";

export const getBooks = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.search) queryParams.append('search', params.search);
  if (params.category) queryParams.append('category', params.category);
  if (params.minFee) queryParams.append('minFee', params.minFee);
  if (params.maxFee) queryParams.append('maxFee', params.maxFee);
  if (params.availability) queryParams.append('availability', params.availability);
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.order) queryParams.append('order', params.order);
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  
  const queryString = queryParams.toString();
  const url = `/api/books${queryString ? `?${queryString}` : ''}`;
  
  return serverFetch(url);
}

export const getBookById = async (bookId) => {
  return serverFetch(`/api/books/${bookId}`);
}