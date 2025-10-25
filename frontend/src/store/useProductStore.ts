import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:5000";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface FormData {
  name: string;
  price: string;
  image: string;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  formData: FormData;
  setFormData: (formData: FormData) => void;
  resetForm: () => void;
  addProduct: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  fetchProducts: () => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  formData: {
    name: "",
    price: "",
    image: "",
  },

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully");
    } catch (error) {
      console.log("Error in addProduct function: ", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data, error: null });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 429)
        set({ error: "Rate limit exceeded", products: [] });
      else set({ error: "Something went wrong", products: [] });
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== id),
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log("Error in deleteProduct function: ", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
}));
