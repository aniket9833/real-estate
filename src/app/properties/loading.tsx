export default function Loading() {
  return (
    <div className="container section-pad">
      <div className="h-8 w-40 bg-primary/5 rounded-lg animate-pulse mb-3" />
      <div className="h-4 w-72 bg-primary/5 rounded-lg animate-pulse mb-10" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border overflow-hidden"
          >
            <div className="aspect-[4/3] bg-primary/5 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-24 bg-primary/5 rounded animate-pulse" />
              <div className="h-5 w-full bg-primary/5 rounded animate-pulse" />
              <div className="h-5 w-2/3 bg-primary/5 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
