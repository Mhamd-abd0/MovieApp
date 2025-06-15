export function MovieCardSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-gray-800" />
      <div className="p-4">
        <div className="h-6 bg-gray-800 rounded mb-2" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-800 rounded w-16" />
          <div className="h-4 bg-gray-800 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 20 }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}