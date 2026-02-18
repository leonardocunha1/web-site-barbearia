-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('CORTE', 'BARBA', 'SOBRANCELHA', 'ESTETICA');

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "type" "ServiceType" NOT NULL DEFAULT 'ESTETICA';
