-- CreateEnum
CREATE TYPE "CouponExpirationType" AS ENUM ('DATE', 'QUANTITY', 'BOTH');

-- AlterTable
ALTER TABLE "coupons" ADD COLUMN     "expirationType" "CouponExpirationType" NOT NULL DEFAULT 'BOTH';
