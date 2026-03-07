-- Seller profiles
CREATE TABLE seller_profiles (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  username   text NOT NULL UNIQUE,
  avatar_url text,
  rating     numeric NOT NULL DEFAULT 0,
  total_sales integer NOT NULL DEFAULT 0,
  followers  integer NOT NULL DEFAULT 0,
  following  integer NOT NULL DEFAULT 0,
  platforms  text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Listings
CREATE TABLE listings (
  id             text PRIMARY KEY,
  seller_id      uuid NOT NULL REFERENCES seller_profiles(id) ON DELETE CASCADE,
  title          text NOT NULL,
  description    text NOT NULL DEFAULT '',
  price          numeric NOT NULL,
  original_price numeric,
  currency       text NOT NULL DEFAULT 'MXN',
  size           text NOT NULL DEFAULT '',
  category       text NOT NULL DEFAULT '',
  brand          text NOT NULL DEFAULT '',
  condition      text NOT NULL DEFAULT '',
  platform       text NOT NULL,
  platform_url   text NOT NULL DEFAULT '',
  images         text[] NOT NULL DEFAULT '{}',
  status         text NOT NULL DEFAULT 'AVAILABLE',
  likes_count    integer NOT NULL DEFAULT 0,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_listings_seller ON listings(seller_id);
CREATE INDEX idx_listings_platform ON listings(platform);
CREATE INDEX idx_listings_status ON listings(status);

-- Comments
CREATE TABLE comments (
  id         text PRIMARY KEY,
  listing_id text NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  text       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_comments_listing ON comments(listing_id);

-- Functions for atomic like count updates
CREATE OR REPLACE FUNCTION increment_likes(listing_id text)
RETURNS void AS $$
  UPDATE listings SET likes_count = likes_count + 1 WHERE id = listing_id;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION decrement_likes(listing_id text)
RETURNS void AS $$
  UPDATE listings SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = listing_id;
$$ LANGUAGE sql;

-- Row Level Security (permissive for now, no auth)
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to seller_profiles" ON seller_profiles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access to listings" ON listings
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access to comments" ON comments
  FOR ALL USING (true) WITH CHECK (true);
