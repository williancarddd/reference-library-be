/*
  Warnings:

  - Changed the type of `type` on the `Reference` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Discipline" ALTER COLUMN "period" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Reference" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ReferenceType";

-- CreateTable
CREATE TABLE "book" (
    "id" SERIAL NOT NULL,
    "catalogingId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "edition" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "publicationPlace" TEXT NOT NULL,

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);
