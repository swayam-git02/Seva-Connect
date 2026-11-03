// Ye central API client frontend ki backend requests ko ek jagah manage karta hai.
// JWT token har protected request ke header mein jata hai aur unauthorized response par local session clear hota hai.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  // Ye browser storage se current login token nikaalta hai.
  getToken() {
    return localStorage.getItem('sevaconnect_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('sevaconnect_token', token);
    } else {
      localStorage.removeItem('sevaconnect_token');
    }
  }

  // Ye JSON ya photo-upload request ke liye sahi headers banata hai.
  // FormData ke saath Content-Type browser khud boundary ke saath set karta hai.
  getHeaders(customHeaders = {}, isFormData = false) {
    const headers = {
      Accept: 'application/json',
      ...customHeaders,
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Ye backend endpoint ko request bhejkar response return karta hai.
  // 401 milne par stale token hata diya jata hai, aur baaki errors caller tak pahunchte hain.
  async request(endpoint, options = {}, isFormData = false) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = this.getHeaders(options.headers, isFormData);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        this.setToken(null);
        localStorage.removeItem('sevaconnect_user');
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw {
          status: response.status,
          message: data?.message || `Request failed with status ${response.status}`,
          data,
        };
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  upload(endpoint, formData, options = {}) {
    return this.request(
      endpoint,
      {
        ...options,
        method: 'POST',
        body: formData,
      },
      true
    );
  }
}

export const apiClient = new ApiClient();
export default apiClient;
