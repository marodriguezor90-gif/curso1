"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ListingStatus } from "@/types/listing";
import type { Listing, ListingFilters, Comment, PriceSortOrder } from "@/types/listing";
import {
  updateStatusAction,
  toggleLikeAction,
  addCommentAction,
  uploadImageAction,
} from "@/actions/listings";

const STORAGE_KEY_ENGAGEMENT = "hub-ventas-engagement";

interface LocalEngagement {
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
}

const loadFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage might be full or unavailable
  }
};

export const useListingsState = (initialListings: Listing[]) => {
  const [engagement, setEngagement] = useState<LocalEngagement>({
    liked: {},
    saved: {},
  });
  const [isHydrated, setIsHydrated] = useState(false);

  const [filters, setFilters] = useState<ListingFilters>({
    platform: "ALL",
    category: "ALL",
    status: "ALL",
    sortByPrice: "NONE",
  });

  const [optimisticStatuses, setOptimisticStatuses] = useState<Record<string, ListingStatus>>({});
  const [optimisticComments, setOptimisticComments] = useState<Record<string, Comment[]>>({});
  const [optimisticLikeDelta, setOptimisticLikeDelta] = useState<Record<string, number>>({});
  const [optimisticImages, setOptimisticImages] = useState<Record<string, string>>({});
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set());

  const prevListingsRef = useRef(initialListings);
  useEffect(() => {
    if (prevListingsRef.current !== initialListings) {
      setOptimisticStatuses({});
      setOptimisticComments({});
      setOptimisticLikeDelta({});
      setOptimisticImages({});
      prevListingsRef.current = initialListings;
    }
  }, [initialListings]);

  useEffect(() => {
    setEngagement(
      loadFromStorage<LocalEngagement>(STORAGE_KEY_ENGAGEMENT, {
        liked: {},
        saved: {},
      })
    );
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage(STORAGE_KEY_ENGAGEMENT, engagement);
  }, [engagement, isHydrated]);

  const listings = useMemo(
    () =>
      initialListings.map((item) => {
        const previewUrl = optimisticImages[item.id];
        return {
          ...item,
          status: optimisticStatuses[item.id] ?? item.status,
          likesCount: item.likesCount + (optimisticLikeDelta[item.id] ?? 0),
          comments: [
            ...item.comments,
            ...(optimisticComments[item.id] ?? []),
          ],
          images: previewUrl ? [previewUrl, ...item.images.slice(1)] : item.images,
        };
      }),
    [initialListings, optimisticStatuses, optimisticLikeDelta, optimisticComments, optimisticImages]
  );

  const filteredListings = useMemo(() => {
    const filtered = listings.reduce<Listing[]>((acc, item) => {
      const matchesPlatform = filters.platform === "ALL" || item.platform === filters.platform;
      const matchesCategory = filters.category === "ALL" || item.category === filters.category;
      const matchesStatus = filters.status === "ALL" || item.status === filters.status;

      if (matchesPlatform && matchesCategory && matchesStatus) {
        acc.push(item);
      }
      return acc;
    }, []);

    if (filters.sortByPrice === "NONE") return filtered;

    const direction = filters.sortByPrice === "ASC" ? 1 : -1;
    return filtered.sort((a, b) => (a.price - b.price) * direction);
  }, [listings, filters]);

  const stats = useMemo(() => {
    let totalActive = 0;
    let totalReserved = 0;
    let totalSold = 0;

    for (const item of listings) {
      if (item.status === ListingStatus.AVAILABLE) totalActive++;
      else if (item.status === ListingStatus.RESERVED) totalReserved++;
      else if (item.status === ListingStatus.SOLD) totalSold++;
    }

    return {
      totalActive,
      totalReserved,
      totalSold,
      totalListings: listings.length,
    };
  }, [listings]);

  const updateStatus = useCallback(async (id: string, status: ListingStatus) => {
    setOptimisticStatuses((prev) => ({ ...prev, [id]: status }));
    await updateStatusAction(id, status);
  }, []);

  const toggleLike = useCallback(
    async (id: string) => {
      const isCurrentlyLiked = engagement.liked[id] ?? false;
      const delta = isCurrentlyLiked ? -1 : 1;

      setEngagement((prev) => ({
        ...prev,
        liked: { ...prev.liked, [id]: !isCurrentlyLiked },
      }));
      setOptimisticLikeDelta((prev) => ({
        ...prev,
        [id]: (prev[id] ?? 0) + delta,
      }));

      await toggleLikeAction(id, isCurrentlyLiked);
    },
    [engagement.liked]
  );

  const toggleSave = useCallback((id: string) => {
    setEngagement((prev) => ({
      ...prev,
      saved: { ...prev.saved, [id]: !prev.saved[id] },
    }));
  }, []);

  const addComment = useCallback(async (id: string, text: string) => {
    const optimistic: Comment = {
      id: `optimistic-${Date.now()}`,
      authorName: "Tú",
      text,
      createdAt: new Date().toISOString(),
    };

    setOptimisticComments((prev) => ({
      ...prev,
      [id]: [...(prev[id] ?? []), optimistic],
    }));

    await addCommentAction(id, text);
  }, []);

  const uploadImage = useCallback(async (id: string, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setOptimisticImages((prev) => ({ ...prev, [id]: previewUrl }));
    setUploadingIds((prev) => new Set(prev).add(id));

    try {
      const formData = new FormData();
      formData.append("listingId", id);
      formData.append("file", file);

      const result = await uploadImageAction(formData);

      if (!result.success) {
        setOptimisticImages((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }

      return result;
    } finally {
      URL.revokeObjectURL(previewUrl);
      setUploadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, []);

  const setPlatformFilter = useCallback((value: ListingFilters["platform"]) => {
    setFilters((prev) => ({ ...prev, platform: value }));
  }, []);

  const setCategoryFilter = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, category: value }));
  }, []);

  const setStatusFilter = useCallback((value: ListingFilters["status"]) => {
    setFilters((prev) => ({ ...prev, status: value }));
  }, []);

  const setPriceSortFilter = useCallback((value: PriceSortOrder) => {
    setFilters((prev) => ({ ...prev, sortByPrice: value }));
  }, []);

  return {
    listings,
    filteredListings,
    filters,
    stats,
    engagement,
    isHydrated,
    uploadingIds,
    updateStatus,
    toggleLike,
    toggleSave,
    addComment,
    uploadImage,
    setPlatformFilter,
    setCategoryFilter,
    setStatusFilter,
    setPriceSortFilter,
  };
};
