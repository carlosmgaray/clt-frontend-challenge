import { configureStore, type Middleware } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import favoritesReducer, {
  FAVORITES_STORAGE_KEY,
  type FavoritesState,
} from "./favoritesSlice";
import { saveState } from "@/lib/localStorage";

const persistFavoritesMiddleware: Middleware =
  (storeApi) => (next) => (action) => {
    const result = next(action);

    if (
      typeof action === "object" &&
      action !== null &&
      "type" in action &&
      typeof action.type === "string" &&
      action.type.startsWith("favorites/")
    ) {
      const state = storeApi.getState() as { favorites: FavoritesState };
      saveState(FAVORITES_STORAGE_KEY, state.favorites);
    }

    return result;
  };

export const store = configureStore({
  reducer: {
    products: productsReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistFavoritesMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
