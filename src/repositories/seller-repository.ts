import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import type { SellerProfile } from "@/types/listing";
import type { Platform } from "@/types/listing";

interface SellerRow {
  id: string;
  name: string;
  username: string;
  avatar_url: string;
  rating: number;
  total_sales: number;
  followers: number;
  following: number;
  platforms: string[];
  created_at: string;
}

const mapRowToSeller = (row: SellerRow): SellerProfile => ({
  name: row.name,
  username: row.username,
  avatarUrl: row.avatar_url,
  rating: row.rating,
  totalSales: row.total_sales,
  followers: row.followers,
  following: row.following,
  platforms: row.platforms as Platform[],
});

export const getSellerByUsername = async (
  username: string
): Promise<SellerProfile | null> => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("seller_profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch seller: ${error.message}`);
  }

  return mapRowToSeller(data as SellerRow);
};
