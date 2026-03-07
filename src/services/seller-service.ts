import "server-only";

import { getSellerByUsername } from "@/repositories/seller-repository";
import type { SellerProfile } from "@/types/listing";

export const getSellerProfile = async (
  username: string
): Promise<SellerProfile | null> => {
  if (!username) return null;
  return getSellerByUsername(username);
};
