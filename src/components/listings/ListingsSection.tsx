"use client";

import { useListingsState } from "@/hooks/useListingsState";
import { SellerHeader } from "@/components/seller/SellerHeader";
import { ListingsFilters } from "@/components/listings/ListingsFilters";
import { ListingsGrid } from "@/components/listings/ListingsGrid";
import { Separator } from "@/components/ui/separator";
import type { Listing, SellerProfile } from "@/types/listing";

interface ListingsSectionProps {
  initialListings: Listing[];
  seller: SellerProfile | null;
}

export const ListingsSection = ({ initialListings, seller }: ListingsSectionProps) => {
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
    uploadImage,
    uploadingIds,
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
      {seller && <SellerHeader seller={seller} stats={stats} />}
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
        uploadingIds={uploadingIds}
        onToggleLike={toggleLike}
        onToggleSave={toggleSave}
        onStatusChange={updateStatus}
        onAddComment={addComment}
        onImageUpload={uploadImage}
      />
    </div>
  );
};
