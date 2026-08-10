"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, reset, searchProducts } from "@/store/productsSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductCard } from "@/components/ProductCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function Home() {
  const dispatch = useAppDispatch();
  const { items, status, error, page, lastAttemptedPage, hasMore } =
    useAppSelector((state) => state.products);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const lastHandledQuery = useRef(debouncedQuery);
  const isSearching = debouncedQuery !== "";

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts({ page: 0 }));
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (lastHandledQuery.current === debouncedQuery) return;
    lastHandledQuery.current = debouncedQuery;

    if (debouncedQuery === "") {
      dispatch(fetchProducts({ page: 0 }));
    } else {
      dispatch(searchProducts({ query: debouncedQuery }));
    }
  }, [debouncedQuery, dispatch]);

  const handleRetry = () =>
    isSearching
      ? dispatch(searchProducts({ query: debouncedQuery }))
      : dispatch(fetchProducts({ page: lastAttemptedPage }));
  const handleLoadMore = () => dispatch(fetchProducts({ page: page + 1 }));
  const handleRefresh = () => dispatch(reset());

  const isInitialLoading = status === "loading" && items.length === 0;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <button
        onClick={handleRefresh}
        disabled={status === "loading"}
        className="mb-4 rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[#ccc]"
      >
        Actualizar
      </button>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos..."
        className="mb-6 w-full rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
      />

      {isInitialLoading && <LoadingSkeleton />}

      {!isInitialLoading && items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {status === "failed" && (
        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
          <button
            onClick={handleRetry}
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Reintentar
          </button>
        </div>
      )}

      {status !== "failed" && !isInitialLoading && !isSearching && items.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={!hasMore || status === "loading"}
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[#ccc]"
          >
            {status === "loading"
              ? "Cargando..."
              : hasMore
                ? "Cargar más"
                : "No hay más productos"}
          </button>
        </div>
      )}
    </main>
  );
}
