import { serverFetch, serverMutation } from '../core/server';

const EMPTY_VALUES = new Set(['', 'All Categories', 'All', 'all', null, undefined]);

// GET: Fetch all books with filters
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

// GET: Fetch a single book by its ID
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


// GET: Librarian overview
export const getLibrarianOverview = async (librarianEmail) => {
  return serverFetch(`/api/librarian/overview?librarianEmail=${librarianEmail}`);
};
// GET: Librarian books
export const getLibrarianBooks = async (librarianEmail) => {
  if (!librarianEmail) return null;
  return serverFetch(`/api/librarian/books?librarianEmail=${encodeURIComponent(librarianEmail)}`);
};
// GET: Librarian orders
export const getLibrarianOrders = async (librarianEmail) => {
  if (!librarianEmail) return null;
  return serverFetch(`/api/librarian/orders?librarianEmail=${encodeURIComponent(librarianEmail)}`);
};
// GET: Librarian transactions
export const updateOrderStatus = async (orderId, status) => {
  return serverMutation(`/api/orders/${orderId}/status`, { status }, 'PATCH');
};

// POST: Create a new book entry using the standard serverFetch helper
export const createBook = async (bookData) => {
  try {
    const response = await serverMutation('/api/books', bookData, 'POST'); 
    return response;
  } catch (error) {
    console.error("API Error in createBook:", error);
    return { success: false, error: error.message };
  }
};

export const updateBook = async (bookId, bookData) => {
  return serverMutation(`/api/books/${bookId}`, bookData, 'PATCH');
};


// DELETE: Book delete
export const deleteBook = async (bookId) => {
  return serverMutation(`/api/books/${bookId}`, {}, 'DELETE');
};

// PATCH: Book status toggle
export const updateBookStatus = async (bookId, status) => {
  return serverMutation(`/api/books/${bookId}/status`, { status }, 'PATCH');
};