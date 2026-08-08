import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "@/types/product";

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

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
});

export default productsSlice.reducer;
