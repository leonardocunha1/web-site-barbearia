/*
  Warnings:

  - You are about to drop the `bonus_rules` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `valorFinal` on table `bookings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bonus_transactions" ADD COLUMN     "operation" TEXT NOT NULL DEFAULT 'CREDIT';

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "pontosUtilizados" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "valorFinal" SET NOT NULL;

-- DropTable
DROP TABLE "bonus_rules";

-- CreateTable
CREATE TABLE "bonus_redemptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "pointsUsed" INTEGER NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bonus_redemptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "bonus_redemptions_userId_idx" ON "bonus_redemptions"("userId");

-- CreateIndex
CREATE INDEX "bonus_redemptions_bookingId_idx" ON "bonus_redemptions"("bookingId");

-- CreateIndex
CREATE INDEX "user_bonus_expiresAt_idx" ON "user_bonus"("expiresAt");

-- AddForeignKey
ALTER TABLE "bonus_redemptions" ADD CONSTRAINT "bonus_redemptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonus_redemptions" ADD CONSTRAINT "bonus_redemptions_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
