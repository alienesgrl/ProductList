import axios from 'axios';

const API_BASE_URL = 'https://localhost:7242/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ringService = {
  getRings: async () => {
    const response = await api.get('/Product');
    return response.data;
  },

  getRingByName: async (name) => {
    const response = await api.get(`/Product/${name}`);
    return response.data;
  },

  getPopularRings: async (minPopularity = 0.8) => {
    const response = await api.get(`/Product/popular?minPopularity=${minPopularity}`);
    return response.data;
  },

  getFilteredRings: async (filters) => {
    const params = new URLSearchParams();
    
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.minPopularity) params.append('minPopularity', filters.minPopularity);
    if (filters.maxPopularity) params.append('maxPopularity', filters.maxPopularity);

    const response = await api.get(`/Product/filter?${params}`);
    return response.data;
  },

  getRingsSortedByPopularity: async () => {
    const response = await api.get('/Product/sorted/popularity');
    return response.data;
  },

  getRingsSortedByPrice: async () => {
    const response = await api.get('/Product/sorted/price');
    return response.data;
  }
};

export default api;