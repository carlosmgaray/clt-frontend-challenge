import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/product";
import type { RootState } from "./index";
import { loadState } from "@/lib/localStorage";

export type FavoritesState = Record<string, Product>;

export const FAVORITES_STORAGE_KEY = "favorites";

const initialState: FavoritesState =
  loadState<FavoritesState>(FAVORITES_STORAGE_KEY) ?? {};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Product>) => {
      state[action.payload.id.toString()] = action.payload;
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;

export const selectIsFavorite = (state: RootState, id: string): boolean =>
  Boolean(state.favorites[id]);

export const selectFavorites = (state: RootState): Product[] =>
  Object.values(state.favorites);

export default favoritesSlice.reducer;
