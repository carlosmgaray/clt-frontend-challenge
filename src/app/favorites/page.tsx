"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { selectFavorites } from "@/store/favoritesSlice";
import { ProductCard } from "@/components/ProductCard";

export default function FavoritesPage() {
  const favorites = useAppSelector(selectFavorites);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Favoritos
      </h1>

      {favorites.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            No tenés favoritos todavía
          </p>
          <Link
            href="/"
            className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Volver al listado
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
