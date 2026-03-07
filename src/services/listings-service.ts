import "server-only";

import {
  getListingsWithComments,
  updateListingStatus as repoUpdateStatus,
  incrementLikesCount,
  decrementLikesCount,
  createComment as repoCreateComment,
} from "@/repositories/listings-repository";
import type { Listing, Comment } from "@/types/listing";
import { ListingStatus } from "@/types/listing";

const VALID_STATUSES = new Set(Object.values(ListingStatus));

export const getAllListings = async (): Promise<Listing[]> => {
  return getListingsWithComments();
};

export const updateStatus = async (
  listingId: string,
  status: ListingStatus
): Promise<{ success: boolean; error?: string }> => {
  if (!listingId) {
    return { success: false, error: "Listing ID is required" };
  }

  if (!VALID_STATUSES.has(status)) {
    return { success: false, error: `Invalid status: ${status}` };
  }

  try {
    await repoUpdateStatus(listingId, status);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
};

export const toggleLike = async (
  listingId: string,
  isCurrentlyLiked: boolean
): Promise<{ success: boolean; error?: string }> => {
  if (!listingId) {
    return { success: false, error: "Listing ID is required" };
  }

  try {
    if (isCurrentlyLiked) {
      await decrementLikesCount(listingId);
    } else {
      await incrementLikesCount(listingId);
    }
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
};

export const addComment = async (
  listingId: string,
  text: string
): Promise<{ success: boolean; data?: Comment; error?: string }> => {
  if (!listingId) {
    return { success: false, error: "Listing ID is required" };
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return { success: false, error: "Comment text cannot be empty" };
  }

  try {
    const comment = await repoCreateComment(listingId, "Tú", trimmed);
    return { success: true, data: comment };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
};
