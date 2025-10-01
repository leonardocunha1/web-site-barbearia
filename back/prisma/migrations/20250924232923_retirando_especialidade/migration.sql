/*
  Warnings:

  - You are about to drop the column `especialidadeId` on the `professionals` table. All the data in the column will be lost.
  - You are about to drop the column `especialidadeId` on the `services` table. All the data in the column will be lost.
  - You are about to drop the `Especialidade` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "professionals" DROP CONSTRAINT "professionals_especialidadeId_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_especialidadeId_fkey";

-- AlterTable
ALTER TABLE "professionals" DROP COLUMN "especialidadeId",
ADD COLUMN     "especialidade" TEXT;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "especialidadeId";

-- DropTable
DROP TABLE "Especialidade";
