const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

//  Token auto fetch
const getToken = async () => {
  try {
    // Server Component tooken fetch
    const { getTokenServer } = await import('./token');
    return await getTokenServer();
  } catch (error) {
    console.log('⚠️ Token fetch failed:', error.message);
    return null;
  }
};

//  Server Fetch - Auto Token
export const serverFetch = async (path, options = {}) => {
  try {
    const { needAuth = false, ...fetchOptions } = options;

    let headers = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    // Auth required token add
    if (needAuth) {
      const token = await getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 Token added automatically', token);
      } else {
        console.log('⚠️ No token found, but auth required');
      }
    }

    const res = await fetch(`${baseUrl}${path}`, {
      ...fetchOptions,
      headers,
      cache: options.cache || 'no-store',
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const text = await res.text();
    if (!text || text.trim() === '') return null;
    return JSON.parse(text);
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw error;
    }
    console.error('Server fetch error:', error);
    throw error;
  }
};

//  Server Mutation - Auto Token
export const serverMutation = async (
  path,
  data,
  method = 'POST',
  options = {},
) => {
  try {
    const { needAuth = true, ...fetchOptions } = options;

    let headers = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    // Auth required auto token add 
    if (needAuth) {
      const token = await getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config = {
      method: method,
      headers: headers,
      ...fetchOptions,
    };

    if (method !== 'GET' && data) {
      config.body = JSON.stringify(data);
    }

    const res = await fetch(`${baseUrl}${path}`, config);

    const text = await res.text();

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new Error('UNAUTHORIZED');
      }

      let errorMessage = `HTTP ${res.status}`;
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = text.substring(0, 200);
      }

      throw new Error(errorMessage);
    }

    if (!text || text.trim() === '') {
      return { success: true, message: 'Operation completed successfully' };
    }

    return JSON.parse(text);
  } catch (error) {
    if (error.message === 'UNAUTHORIZED') {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw error;
    }
    console.error(`Server mutation error for ${path}:`, error);
    throw error;
  }
};

// Shortcut functions
export const authFetch = (path, options = {}) => {
  return serverFetch(path, { ...options, needAuth: true });
};

export const authMutation = (path, data, method = 'POST', options = {}) => {
  return serverMutation(path, data, method, { ...options, needAuth: true });
};
