import { serverFetch } from '../core/server';


const EMPTY_VALUES = new Set(['', 'All Categories', 'All', 'all', null, undefined]);

export const getBooks = async (params = {}) => {
  const cleanParams = {};

  Object.entries(params).forEach(([key, value]) => {
    if (!EMPTY_VALUES.has(value)) {
      cleanParams[key] = value;
    }
  });

  const queryString = new URLSearchParams(cleanParams).toString();
  const url = `/api/books${queryString ? `?${queryString}` : ''}`;

  return serverFetch(url);
};

// get book by id for single book details
export const getBookById = async (bookId) => {
  if (!bookId) {
    console.warn('⚠️ No bookId provided');
    return null;
  }
  
  try {
    const response = await serverFetch(`/api/books/${bookId}`);
    return response;
  } catch (error) {
    console.error('❌ Error fetching book by ID:', error);
    throw error;
  }
};