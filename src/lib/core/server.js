const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const serverFetch = async (path) => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const text = await res.text();
    if (!text || text.trim() === '') {
      return null;
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Server fetch error:', error);
    throw error;
  }
};





export const serverMutation = async (path, data, method = 'POST') => {
  try {
    const fullUrl = `${baseUrl}${path}`;
    console.log(`[Server Mutation] Sending to ${fullUrl} via ${method}:`, data); 
    
    const config = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (method !== 'GET' && data) {
      config.body = JSON.stringify(data);
    }

    const res = await fetch(fullUrl, config);

    const text = await res.text();
    
    if (!res.ok) {
      console.error(`Mutation Error: ${res.status} for ${path}`);
      console.error('Response body:', text);
      
      let errorMessage = `HTTP ${res.status}`;
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch(e) {
        errorMessage = text.substring(0, 200);
      }
      
      throw new Error(errorMessage);
    }

    if (!text || text.trim() === '') {
      return { success: true, message: 'Operation completed successfully' };
    }

    return JSON.parse(text);
  } catch (error) {
    console.error(`Server mutation error for ${path}:`, error);
    throw error;
  }
};
