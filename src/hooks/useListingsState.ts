"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ListingStatus } from "@/types/listing";
import type { Listing, ListingFilters, CommentMock, EngagementState, PriceSortOrder } from "@/types/listing";

const STORAGE_KEY_STATUS = "hub-ventas-statuses";
const STORAGE_KEY_ENGAGEMENT = "hub-ventas-engagement";

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
  const [statusOverrides, setStatusOverrides] = useState<Record<string, ListingStatus>>({});
  const [engagement, setEngagement] = useState<EngagementState>({
    liked: {},
    saved: {},
    comments: {},
  });
  const [isHydrated, setIsHydrated] = useState(false);

  const [filters, setFilters] = useState<ListingFilters>({
    platform: "ALL",
    category: "ALL",
    status: "ALL",
    sortByPrice: "NONE",
  });

  useEffect(() => {
    setStatusOverrides(loadFromStorage<Record<string, ListingStatus>>(STORAGE_KEY_STATUS, {}));
    setEngagement(
      loadFromStorage<EngagementState>(STORAGE_KEY_ENGAGEMENT, {
        liked: {},
        saved: {},
        comments: {},
      })
    );
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage(STORAGE_KEY_STATUS, statusOverrides);
  }, [statusOverrides, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    saveToStorage(STORAGE_KEY_ENGAGEMENT, engagement);
  }, [engagement, isHydrated]);

  const listings = useMemo(
    () =>
      initialListings.map((item) => ({
        ...item,
        status: statusOverrides[item.id] ?? item.status,
      })),
    [initialListings, statusOverrides]
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

  const updateStatus = useCallback((id: string, status: ListingStatus) => {
    setStatusOverrides((prev) => ({ ...prev, [id]: status }));
  }, []);

  const toggleLike = useCallback((id: string) => {
    setEngagement((prev) => ({
      ...prev,
      liked: { ...prev.liked, [id]: !prev.liked[id] },
    }));
  }, []);

  const toggleSave = useCallback((id: string) => {
    setEngagement((prev) => ({
      ...prev,
      saved: { ...prev.saved, [id]: !prev.saved[id] },
    }));
  }, []);

  const addComment = useCallback((id: string, text: string) => {
    const newComment: CommentMock = {
      id: `user-${Date.now()}`,
      authorName: "Tú",
      text,
      createdAt: new Date().toISOString(),
    };

    setEngagement((prev) => ({
      ...prev,
      comments: {
        ...prev.comments,
        [id]: [...(prev.comments[id] ?? []), newComment],
      },
    }));
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
    updateStatus,
    toggleLike,
    toggleSave,
    addComment,
    setPlatformFilter,
    setCategoryFilter,
    setStatusFilter,
    setPriceSortFilter,
  };
};
