import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.thumbnail}
        alt={product.title}
        className="mb-3 h-40 w-full rounded-md object-cover"
      />
      <h3 className="line-clamp-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
        {product.title}
      </h3>
      <p className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-50">
        ${product.price.toFixed(2)}
      </p>
    </div>
  );
}
