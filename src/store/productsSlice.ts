import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/lib/axios";
import type { Product, ProductsResponse } from "@/types/product";

export type ProductsStatus = "idle" | "loading" | "succeeded" | "failed";

export interface ProductsState {
  items: Product[];
  status: ProductsStatus;
  error: string | null;
  page: number;
  lastAttemptedPage: number;
  hasMore: boolean;
}

const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
  page: 0,
  lastAttemptedPage: 0,
  hasMore: true,
};

const PAGE_SIZE = 10;

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page }: { page: number }) => {
    const response = await api.get<ProductsResponse>("/products", {
      params: { limit: PAGE_SIZE, skip: page * PAGE_SIZE },
    });
    return response.data;
  }
);

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async ({ query }: { query: string }) => {
    const response = await api.get<ProductsResponse>("/products/search", {
      params: { q: query },
    });
    return response.data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.lastAttemptedPage = action.meta.arg.page;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { products, skip, limit, total } = action.payload;
        const requestedPage = action.meta.arg.page;

        if (requestedPage === 0) {
          state.items = products;
        } else {
          const existingIds = new Set(state.items.map((item) => item.id));
          const newProducts = products.filter(
            (product) => !existingIds.has(product.id)
          );
          state.items = state.items.concat(newProducts);
        }

        state.status = "succeeded";
        state.page = requestedPage;
        state.hasMore = skip + limit < total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch products";
      })
      .addCase(searchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        const { products, skip, limit, total } = action.payload;
        state.status = "succeeded";
        state.items = products;
        state.page = 0;
        state.hasMore = skip + limit < total;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to search products";
      });
  },
});

export const { reset } = productsSlice.actions;
export default productsSlice.reducer;
