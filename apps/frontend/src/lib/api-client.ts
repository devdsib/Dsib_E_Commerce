import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ── Request Interceptor: auto-attach JWT from auth store ──
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productApi = {
  getProducts: async (params?: any) => {
    const response = await apiClient.get("/products", { params });
    return response.data;
  },
  getProductBySlug: async (slug: string) => {
    const response = await apiClient.get(`/products/${slug}`);
    return response.data;
  },
  createProduct: async (data: any) => {
    const response = await apiClient.post("/products", data);
    return response.data;
  },
  updateProduct: async (id: string, data: any) => {
    const response = await apiClient.patch(`/products/${id}`, data);
    return response.data;
  },
  deleteProduct: async (id: string) => {
    await apiClient.delete(`/products/${id}`);
  },
};

export const categoryApi = {
  getCategories: async () => {
    const response = await apiClient.get("/categories");
    return response.data;
  },
};

export const authApi = {
  login: async (credentials: any) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },
  register: async (data: any) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },
  getProfile: async (token?: string | null) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.get("/auth/profile", { headers });
    return response.data;
  },
};

export const orderApi = {
  createOrder: async (data: any, token?: string | null) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.post("/orders", data, { headers });
    return response.data;
  },
  getMyOrders: async (token?: string | null) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.get("/orders/me", { headers });
    return response.data;
  },
  verifyPayment: async (data: any, token?: string | null) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await apiClient.post("/orders/verify", data, { headers });
    return response.data;
  },
};
