"use server";

import { revalidatePath } from "next/cache";
import {
  updateStatus,
  toggleLike,
  addComment,
} from "@/services/listings-service";
import type { ListingStatus } from "@/types/listing";

export const updateStatusAction = async (
  listingId: string,
  status: ListingStatus
) => {
  const result = await updateStatus(listingId, status);

  if (result.success) {
    revalidatePath("/");
  }

  return result;
};

export const toggleLikeAction = async (
  listingId: string,
  isCurrentlyLiked: boolean
) => {
  const result = await toggleLike(listingId, isCurrentlyLiked);

  if (result.success) {
    revalidatePath("/");
  }

  return result;
};

export const addCommentAction = async (listingId: string, text: string) => {
  const result = await addComment(listingId, text);

  if (result.success) {
    revalidatePath("/");
  }

  return result;
};
