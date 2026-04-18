-- Phase 1: create EventCategory table
CREATE TABLE "EventCategory" (
  "id"        TEXT         NOT NULL,
  "name"      TEXT         NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EventCategory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EventCategory_name_key" ON "EventCategory"("name");

-- Phase 2: backfill categories from existing eventType values
INSERT INTO "EventCategory" ("id", "name", "createdAt")
SELECT gen_random_uuid(), et, NOW()
FROM (SELECT DISTINCT "eventType" AS et FROM "Event" WHERE "eventType" IS NOT NULL) sub;

-- Add nullable categoryId column
ALTER TABLE "Event" ADD COLUMN "categoryId" TEXT;

-- Map each event row to its new category
UPDATE "Event" e
SET "categoryId" = ec."id"
FROM "EventCategory" ec
WHERE e."eventType" = ec."name";

-- Phase 3: finalize
ALTER TABLE "Event" ALTER COLUMN "categoryId" SET NOT NULL;

ALTER TABLE "Event"
  ADD CONSTRAINT "Event_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "EventCategory"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Event" DROP COLUMN "eventType";

DROP INDEX IF EXISTS "Event_status_eventType_startDate_idx";

CREATE INDEX "Event_status_categoryId_startDate_idx"
  ON "Event"("status", "categoryId", "startDate");
