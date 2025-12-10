-- Add location and country fields to service_listings
ALTER TABLE service_listings
ADD COLUMN IF NOT EXISTS location VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100);

-- Add index for location/country filtering
CREATE INDEX IF NOT EXISTS idx_service_listings_location ON service_listings(location);
CREATE INDEX IF NOT EXISTS idx_service_listings_country ON service_listings(country);

-- Add country field to marketplace_listings for consistency
ALTER TABLE marketplace_listings
ADD COLUMN IF NOT EXISTS country VARCHAR(100);

-- Add index for country filtering on marketplace
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_country ON marketplace_listings(country);

