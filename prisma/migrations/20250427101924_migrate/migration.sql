/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Content` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "slug" TEXT,
ALTER COLUMN "category" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Content_slug_key" ON "Content"("slug");
