import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "@/lib/axios";
import type { Product, ProductsResponse } from "@/types/product";

export type ProductsStatus = "idle" | "loading" | "succeeded" | "failed";

export interface ProductsState {
  items: Product[];
  status: ProductsStatus;
  error: string | null;
  page: number;
  hasMore: boolean;
}

const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
  page: 0,
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

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { products, skip, limit, total } = action.payload;
        state.status = "succeeded";
        state.items = state.items.concat(products);
        state.page = action.meta.arg.page;
        state.hasMore = skip + limit < total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch products";
      });
  },
});

export default productsSlice.reducer;
