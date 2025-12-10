// src/api/products.ts

import api from "./client";
import { Product, mockProducts } from "../mock/Products";

/**
 * Fetch products from backend.
 * Falls back to mock data if API fails.
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const res = await api.get<Product[]>("/products");

    if (Array.isArray(res.data)) {
      return res.data;
    }

    // unexpected response shape
    console.warn("Products API returned invalid data, using mock data");
    return mockProducts;
  } catch (error) {
    console.error("Failed to fetch products from API, using mock data", error);
    return mockProducts;
  }
};

/**
 * (Future) Add new product
 */
export const createProduct = async (
  payload: Omit<Product, "id">
): Promise<Product> => {
  const res = await api.post<Product>("/products", payload);
  return res.data;
};

/**
 * (Future) Update product
 */
export const updateProduct = async (
  id: number | string,
  payload: Partial<Omit<Product, "id">>
): Promise<Product> => {
  const res = await api.put<Product>(`/products/${id}`, payload);
  return res.data;
};

/**
 * (Future) Delete product
 */
export const deleteProduct = async (
  id: number | string
): Promise<void> => {
  await api.delete(`/products/${id}`);
};
