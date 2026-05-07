import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
  return (
    <div className="w-full space-y-4">
      {/* Search Bar Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border border-border">
        {/* Table Header */}
        <div className="border-b border-border bg-muted/50 p-4 flex gap-4">
          <Skeleton className="h-6 w-[20%]" />
          <Skeleton className="h-6 w-[30%]" />
          <Skeleton className="h-6 w-[20%]" />
          <Skeleton className="h-6 w-[30%]" />
        </div>
        
        {/* Table Rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4 border-b border-border last:border-0">
            <Skeleton className="h-5 w-[20%]" />
            <Skeleton className="h-5 w-[30%]" />
            <Skeleton className="h-5 w-[20%]" />
            <Skeleton className="h-5 w-[30%]" />
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Skeleton className="h-8 w-[100px]" />
        <Skeleton className="h-8 w-[70px]" />
      </div>
    </div>
  )
}
