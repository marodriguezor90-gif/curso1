import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import type { Listing, Comment } from "@/types/listing";
import type { Platform, ListingStatus } from "@/types/listing";

interface ListingRow {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  currency: string;
  size: string;
  category: string;
  brand: string;
  condition: string;
  platform: string;
  platform_url: string;
  images: string[];
  status: string;
  likes_count: number;
  created_at: string;
}

interface CommentRow {
  id: string;
  listing_id: string;
  author_name: string;
  text: string;
  created_at: string;
}

const mapRowToListing = (
  row: ListingRow,
  comments: Comment[]
): Listing => ({
  id: row.id,
  title: row.title,
  description: row.description,
  price: row.price,
  originalPrice: row.original_price ?? undefined,
  currency: row.currency as Listing["currency"],
  size: row.size,
  category: row.category,
  brand: row.brand,
  condition: row.condition,
  platform: row.platform as Platform,
  platformUrl: row.platform_url,
  images: row.images,
  status: row.status as ListingStatus,
  likesCount: row.likes_count,
  comments,
  createdAt: row.created_at,
});

const mapRowToComment = (row: CommentRow): Comment => ({
  id: row.id,
  authorName: row.author_name,
  text: row.text,
  createdAt: row.created_at,
});

export const getListingsWithComments = async (): Promise<Listing[]> => {
  const supabase = createServerClient();

  const [listingsResult, commentsResult] = await Promise.all([
    supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("comments")
      .select("*")
      .order("created_at", { ascending: true }),
  ]);

  if (listingsResult.error) {
    throw new Error(`Failed to fetch listings: ${listingsResult.error.message}`);
  }
  if (commentsResult.error) {
    throw new Error(`Failed to fetch comments: ${commentsResult.error.message}`);
  }

  const commentsByListing = new Map<string, Comment[]>();
  for (const row of commentsResult.data as CommentRow[]) {
    const mapped = mapRowToComment(row);
    const existing = commentsByListing.get(row.listing_id) ?? [];
    existing.push(mapped);
    commentsByListing.set(row.listing_id, existing);
  }

  return (listingsResult.data as ListingRow[]).map((row) =>
    mapRowToListing(row, commentsByListing.get(row.id) ?? [])
  );
};

export const updateListingStatus = async (
  id: string,
  status: ListingStatus
): Promise<void> => {
  const supabase = createServerClient();

  const { error } = await supabase
    .from("listings")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update listing status: ${error.message}`);
  }
};

export const incrementLikesCount = async (id: string): Promise<void> => {
  const supabase = createServerClient();

  const { error } = await supabase.rpc("increment_likes", {
    listing_id: id,
  });

  if (error) {
    throw new Error(`Failed to increment likes: ${error.message}`);
  }
};

export const decrementLikesCount = async (id: string): Promise<void> => {
  const supabase = createServerClient();

  const { error } = await supabase.rpc("decrement_likes", {
    listing_id: id,
  });

  if (error) {
    throw new Error(`Failed to decrement likes: ${error.message}`);
  }
};

export const createComment = async (
  listingId: string,
  authorName: string,
  text: string
): Promise<Comment> => {
  const supabase = createServerClient();

  const commentId = `user-${Date.now()}`;
  const now = new Date().toISOString();

  const { error } = await supabase.from("comments").insert({
    id: commentId,
    listing_id: listingId,
    author_name: authorName,
    text,
    created_at: now,
  });

  if (error) {
    throw new Error(`Failed to create comment: ${error.message}`);
  }

  return {
    id: commentId,
    authorName,
    text,
    createdAt: now,
  };
};
