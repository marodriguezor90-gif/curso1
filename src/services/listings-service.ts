import "server-only";

import {
  getListingsWithComments,
  updateListingStatus as repoUpdateStatus,
  incrementLikesCount,
  decrementLikesCount,
  createComment as repoCreateComment,
  uploadListingImage as repoUploadImage,
  updateListingImages as repoUpdateImages,
  getListingImages,
} from "@/repositories/listings-repository";
import type { Listing, Comment } from "@/types/listing";
import { ListingStatus } from "@/types/listing";

const VALID_STATUSES = new Set(Object.values(ListingStatus));
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

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

export const uploadListingImage = async (
  listingId: string,
  file: File
): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  if (!listingId) {
    return { success: false, error: "Listing ID is required" };
  }

  if (!file || file.size === 0) {
    return { success: false, error: "File is required" };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return {
      success: false,
      error: "Formato no válido. Usa JPEG, PNG o WebP",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: "La imagen no puede pesar más de 5MB",
    };
  }

  try {
    const publicUrl = await repoUploadImage(listingId, file);
    const currentImages = await getListingImages(listingId);
    const updatedImages = [publicUrl, ...currentImages.slice(1)];
    await repoUpdateImages(listingId, updatedImages);

    return { success: true, imageUrl: publicUrl };
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
