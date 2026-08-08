"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/lib/axios";
import type { Product } from "@/types/product";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchProduct = useCallback(() => {
    api
      .get<Product>(`/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to fetch product");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-zinc-600 hover:underline dark:text-zinc-400"
      >
        ← Volver al listado
      </Link>

      {loading && <ProductDetailSkeleton />}

      {!loading && error && (
        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
          <button
            onClick={fetchProduct}
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && product && (
        <div className="grid gap-8 sm:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0] ?? product.thumbnail}
            alt={product.title}
            className="w-full rounded-lg object-cover"
          />

          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {product.title}
            </h1>
            <p className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              ${product.price.toFixed(2)}
            </p>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              {product.description}
            </p>

            <button
              onClick={() => setIsFavorite((prev) => !prev)}
              className="mt-6 w-fit rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              {isFavorite ? "★ Quitar de favoritos" : "☆ Agregar a favoritos"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 sm:grid-cols-2">
      <div className="h-80 w-full rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="flex flex-col gap-3">
        <div className="h-6 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-6 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-4 h-10 w-40 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
