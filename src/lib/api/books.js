import { serverFetch, authFetch, authMutation } from '../core/server';

const EMPTY_VALUES = new Set([
  '',
  'All Categories',
  'All',
  'all',
  null,
  undefined,
]);

// GET: Fetch all books with filters (Public)
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

// GET: Fetch a single book by its ID (Public)
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

// PROTECTED - Auto Token Added

// GET: Librarian overview (Token needed)
export const getLibrarianOverview = async (librarianEmail) => {
  return authFetch(`/api/librarian/overview?librarianEmail=${librarianEmail}`);
};

// GET: Librarian books (Token needed)
export const getLibrarianBooks = async (librarianEmail) => {
  if (!librarianEmail) return null;
  return authFetch(
    `/api/librarian/books?librarianEmail=${encodeURIComponent(librarianEmail)}`,
  );
};

// GET: Librarian orders (Token needed)
export const getLibrarianOrders = async (librarianEmail) => {
  if (!librarianEmail) return null;
  return authFetch(
    `/api/librarian/orders?librarianEmail=${encodeURIComponent(librarianEmail)}`,
  );
};

// PATCH: Update order status (Token needed)
export const updateOrderStatus = async (orderId, status) => {
  return authMutation(`/api/orders/${orderId}/status`, { status }, 'PATCH');
};

// POST: Create a new book (Token needed)
export const createBook = async (bookData) => {
  try {
    const response = await authMutation('/api/books', bookData, 'POST');
    return response;
  } catch (error) {
    console.error('API Error in createBook:', error);
    return { success: false, error: error.message };
  }
};

// PATCH: Update book (Token needed)
export const updateBook = async (bookId, bookData) => {
  return authMutation(`/api/books/${bookId}`, bookData, 'PATCH');
};

// DELETE: Delete book (Token needed)
export const deleteBook = async (bookId) => {
  return authMutation(`/api/books/${bookId}`, {}, 'DELETE');
};

// PATCH: Toggle book status (Token needed)
export const updateBookStatus = async (bookId, status) => {
  return authMutation(`/api/books/${bookId}/status`, { status }, 'PATCH');
};
