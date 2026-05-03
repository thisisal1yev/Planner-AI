-- Rename enum value
ALTER TYPE "PaymentType" RENAME VALUE 'SQUARE' TO 'VENUE';

-- Rename tables
ALTER TABLE "Square" RENAME TO "Venue";
ALTER TABLE "SquareCategory" RENAME TO "VenueCategory";
ALTER TABLE "SquareCharacteristic" RENAME TO "VenueCharacteristic";
ALTER TABLE "SquareBadge" RENAME TO "VenueBadge";

-- Rename implicit M2M join table
ALTER TABLE "_SquareToSquareCharacteristic" RENAME TO "_VenueToVenueCharacteristic";

-- Rename squareId columns
ALTER TABLE "Event" RENAME COLUMN "squareId" TO "venueId";
ALTER TABLE "Booking" RENAME COLUMN "squareId" TO "venueId";
ALTER TABLE "Boost" RENAME COLUMN "squareId" TO "venueId";
ALTER TABLE "RatingStats" RENAME COLUMN "squareId" TO "venueId";
ALTER TABLE "Review" RENAME COLUMN "squareId" TO "venueId";
ALTER TABLE "VenueBadge" RENAME COLUMN "squareId" TO "venueId";

-- Rename foreign key constraints on Venue table
ALTER TABLE "Venue" RENAME CONSTRAINT "Square_ownerId_fkey" TO "Venue_ownerId_fkey";
ALTER TABLE "Venue" RENAME CONSTRAINT "Square_categoryId_fkey" TO "Venue_categoryId_fkey";

-- Rename foreign key constraints on related tables
ALTER TABLE "Event" RENAME CONSTRAINT "Event_squareId_fkey" TO "Event_venueId_fkey";
ALTER TABLE "Booking" RENAME CONSTRAINT "Booking_squareId_fkey" TO "Booking_venueId_fkey";
ALTER TABLE "Boost" RENAME CONSTRAINT "Boost_squareId_fkey" TO "Boost_venueId_fkey";
ALTER TABLE "RatingStats" RENAME CONSTRAINT "RatingStats_squareId_fkey" TO "RatingStats_venueId_fkey";
ALTER TABLE "Review" RENAME CONSTRAINT "Review_squareId_fkey" TO "Review_venueId_fkey";
ALTER TABLE "VenueBadge" RENAME CONSTRAINT "SquareBadge_squareId_fkey" TO "VenueBadge_venueId_fkey";
ALTER TABLE "VenueBadge" RENAME CONSTRAINT "SquareBadge_badgeId_fkey" TO "VenueBadge_badgeId_fkey";

-- Rename unique indexes on VenueBadge and RatingStats (these are UNIQUE INDEXes, not named CONSTRAINTs)
ALTER INDEX "SquareBadge_squareId_badgeId_key" RENAME TO "VenueBadge_venueId_badgeId_key";
ALTER INDEX "RatingStats_squareId_key" RENAME TO "RatingStats_venueId_key";

-- Rename indexes on Venue table
DROP INDEX IF EXISTS "Square_city_categoryId_idx";
CREATE INDEX "Venue_city_categoryId_idx" ON "Venue"("city", "categoryId");

DROP INDEX IF EXISTS "Square_city_capacity_idx";
CREATE INDEX "Venue_city_capacity_idx" ON "Venue"("city", "capacity");

DROP INDEX IF EXISTS "Square_city_pricePerDay_idx";
CREATE INDEX "Venue_city_pricePerDay_idx" ON "Venue"("city", "pricePerDay");

DROP INDEX IF EXISTS "Square_ownerId_idx";
CREATE INDEX "Venue_ownerId_idx" ON "Venue"("ownerId");

-- Rename indexes on related tables
DROP INDEX IF EXISTS "Event_squareId_idx";
CREATE INDEX "Event_venueId_idx" ON "Event"("venueId");

DROP INDEX IF EXISTS "Booking_squareId_status_startDate_endDate_idx";
CREATE INDEX "Booking_venueId_status_startDate_endDate_idx" ON "Booking"("venueId", "status", "startDate", "endDate");

DROP INDEX IF EXISTS "Review_squareId_createdAt_idx";
CREATE INDEX "Review_venueId_createdAt_idx" ON "Review"("venueId", "createdAt" DESC);

-- Update trigger functions: replace squareId references with venueId
-- Must DROP first because PostgreSQL does not allow renaming parameter names via CREATE OR REPLACE
DROP FUNCTION IF EXISTS recalc_rating_stats_for_target(text, text);

CREATE OR REPLACE FUNCTION recalc_rating_stats_for_target(
  p_venue_id   TEXT,
  p_service_id TEXT
) RETURNS VOID AS $$
DECLARE
  v_avg   FLOAT;
  v_count INT;
  v_one   INT;
  v_two   INT;
  v_three INT;
  v_four  INT;
  v_five  INT;
BEGIN
  SELECT
    COALESCE(AVG(rating)::float, 0),
    COUNT(*)::int,
    COUNT(*) FILTER (WHERE rating = 1)::int,
    COUNT(*) FILTER (WHERE rating = 2)::int,
    COUNT(*) FILTER (WHERE rating = 3)::int,
    COUNT(*) FILTER (WHERE rating = 4)::int,
    COUNT(*) FILTER (WHERE rating = 5)::int
  INTO v_avg, v_count, v_one, v_two, v_three, v_four, v_five
  FROM "Review"
  WHERE
    (p_venue_id   IS NOT NULL AND "venueId"   = p_venue_id)
    OR
    (p_service_id IS NOT NULL AND "serviceId" = p_service_id);

  IF v_count = 0 THEN
    DELETE FROM "RatingStats"
    WHERE
      (p_venue_id   IS NOT NULL AND "venueId"   = p_venue_id)
      OR
      (p_service_id IS NOT NULL AND "serviceId" = p_service_id);
    RETURN;
  END IF;

  IF p_venue_id IS NOT NULL THEN
    INSERT INTO "RatingStats" (
      id, "venueId", avg, count, one, two, three, four, five, "updatedAt"
    )
    VALUES (
      gen_random_uuid(), p_venue_id,
      v_avg, v_count, v_one, v_two, v_three, v_four, v_five, NOW()
    )
    ON CONFLICT ("venueId") DO UPDATE SET
      avg         = EXCLUDED.avg,
      count       = EXCLUDED.count,
      one         = EXCLUDED.one,
      two         = EXCLUDED.two,
      three       = EXCLUDED.three,
      four        = EXCLUDED.four,
      five        = EXCLUDED.five,
      "updatedAt" = NOW();
  ELSIF p_service_id IS NOT NULL THEN
    INSERT INTO "RatingStats" (
      id, "serviceId", avg, count, one, two, three, four, five, "updatedAt"
    )
    VALUES (
      gen_random_uuid(), p_service_id,
      v_avg, v_count, v_one, v_two, v_three, v_four, v_five, NOW()
    )
    ON CONFLICT ("serviceId") DO UPDATE SET
      avg         = EXCLUDED.avg,
      count       = EXCLUDED.count,
      one         = EXCLUDED.one,
      two         = EXCLUDED.two,
      three       = EXCLUDED.three,
      four        = EXCLUDED.four,
      five        = EXCLUDED.five,
      "updatedAt" = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION trg_review_sync_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD."venueId" IS NOT NULL OR OLD."serviceId" IS NOT NULL THEN
      PERFORM recalc_rating_stats_for_target(OLD."venueId", OLD."serviceId");
    END IF;
    IF NEW."venueId" IS NOT NULL OR NEW."serviceId" IS NOT NULL THEN
      PERFORM recalc_rating_stats_for_target(NEW."venueId", NEW."serviceId");
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW."venueId" IS NOT NULL OR NEW."serviceId" IS NOT NULL THEN
      PERFORM recalc_rating_stats_for_target(NEW."venueId", NEW."serviceId");
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    IF OLD."venueId" IS NOT NULL OR OLD."serviceId" IS NOT NULL THEN
      PERFORM recalc_rating_stats_for_target(OLD."venueId", OLD."serviceId");
    END IF;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
