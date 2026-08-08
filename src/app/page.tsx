"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/productsSlice";
import { ProductCard } from "@/components/ProductCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function Home() {
  const dispatch = useAppDispatch();
  const { items, status, error, page, lastAttemptedPage, hasMore } =
    useAppSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts({ page: 0 }));
    }
  }, [status, dispatch]);

  const handleRetry = () => dispatch(fetchProducts({ page: lastAttemptedPage }));
  const handleLoadMore = () => dispatch(fetchProducts({ page: page + 1 }));

  const isInitialLoading = status === "loading" && items.length === 0;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
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

      {status !== "failed" && !isInitialLoading && items.length > 0 && (
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
