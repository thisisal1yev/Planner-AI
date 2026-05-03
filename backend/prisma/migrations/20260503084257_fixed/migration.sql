/*
  Warnings:

  - Added the required column `city` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "city" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Venue" RENAME CONSTRAINT "Square_pkey" TO "Venue_pkey";

-- AlterTable
ALTER TABLE "VenueBadge" RENAME CONSTRAINT "SquareBadge_pkey" TO "VenueBadge_pkey";

-- AlterTable
ALTER TABLE "VenueCategory" RENAME CONSTRAINT "SquareCategory_pkey" TO "VenueCategory_pkey";

-- AlterTable
ALTER TABLE "VenueCharacteristic" RENAME CONSTRAINT "SquareCharacteristic_pkey" TO "VenueCharacteristic_pkey";

-- AlterTable
ALTER TABLE "_VenueToVenueCharacteristic" RENAME CONSTRAINT "_SquareToSquareCharacteristic_AB_pkey" TO "_VenueToVenueCharacteristic_AB_pkey";

-- RenameIndex
ALTER INDEX "SquareCategory_name_key" RENAME TO "VenueCategory_name_key";

-- RenameIndex
ALTER INDEX "SquareCharacteristic_name_key" RENAME TO "VenueCharacteristic_name_key";

-- RenameIndex
ALTER INDEX "_SquareToSquareCharacteristic_B_index" RENAME TO "_VenueToVenueCharacteristic_B_index";
