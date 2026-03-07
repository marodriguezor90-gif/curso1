"use client";

import { useListingsState } from "@/hooks/useListingsState";
import { SellerHeader } from "@/components/seller/SellerHeader";
import { ListingsFilters } from "@/components/listings/ListingsFilters";
import { ListingsGrid } from "@/components/listings/ListingsGrid";
import { Separator } from "@/components/ui/separator";
import type { Listing } from "@/types/listing";

interface ListingsSectionProps {
  initialListings: Listing[];
}

export const ListingsSection = ({ initialListings }: ListingsSectionProps) => {
  const {
    filteredListings,
    filters,
    stats,
    engagement,
    isHydrated,
    updateStatus,
    toggleLike,
    toggleSave,
    addComment,
    setPlatformFilter,
    setCategoryFilter,
    setStatusFilter,
    setPriceSortFilter,
  } = useListingsState(initialListings);

  if (!isHydrated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SellerHeader stats={stats} />
      <Separator />
      <ListingsFilters
        filters={filters}
        onPlatformChange={setPlatformFilter}
        onCategoryChange={setCategoryFilter}
        onStatusChange={setStatusFilter}
        onPriceSortChange={setPriceSortFilter}
        resultCount={filteredListings.length}
      />
      <ListingsGrid
        listings={filteredListings}
        likedMap={engagement.liked}
        savedMap={engagement.saved}
        commentsMap={engagement.comments}
        onToggleLike={toggleLike}
        onToggleSave={toggleSave}
        onStatusChange={updateStatus}
        onAddComment={addComment}
      />
    </div>
  );
};
