/*
  Warnings:

  - The values [CLIENTE,PROFISSIONAL] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDENTE,CONFIRMADO,CANCELADO,CONCLUIDO] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `duracao` on the `booking_items` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `booking_items` table. All the data in the column will be lost.
  - You are about to drop the column `preco` on the `booking_items` table. All the data in the column will be lost.
  - You are about to drop the column `dataHoraFim` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `dataHoraInicio` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `observacoes` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `pontosUtilizados` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `profissionalId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `valorFinal` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `abreAs` on the `business_hours` table. All the data in the column will be lost.
  - You are about to drop the column `ativo` on the `business_hours` table. All the data in the column will be lost.
  - You are about to drop the column `diaSemana` on the `business_hours` table. All the data in the column will be lost.
  - You are about to drop the column `fechaAs` on the `business_hours` table. All the data in the column will be lost.
  - You are about to drop the column `pausaFim` on the `business_hours` table. All the data in the column will be lost.
  - You are about to drop the column `pausaInicio` on the `business_hours` table. All the data in the column will be lost.
  - You are about to drop the column `profissionalId` on the `business_hours` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `holidays` table. All the data in the column will be lost.
  - You are about to drop the column `motivo` on the `holidays` table. All the data in the column will be lost.
  - You are about to drop the column `profissionalId` on the `holidays` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `entidade` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `referencia` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `ativo` on the `professionals` table. All the data in the column will be lost.
  - You are about to drop the column `documento` on the `professionals` table. All the data in the column will be lost.
  - You are about to drop the column `especialidade` on the `professionals` table. All the data in the column will be lost.
  - You are about to drop the column `duracao` on the `service_professional` table. All the data in the column will be lost.
  - You are about to drop the column `preco` on the `service_professional` table. All the data in the column will be lost.
  - You are about to drop the column `ativo` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `categoria` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[professionalId,dayOfWeek]` on the table `business_hours` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `duration` to the `booking_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `booking_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `booking_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDateTime` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professionalId` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closesAt` to the `business_hours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dayOfWeek` to the `business_hours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `opensAt` to the `business_hours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professionalId` to the `business_hours` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `holidays` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professionalId` to the `holidays` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `holidays` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialty` to the `professionals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `service_professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `service_professional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'CLIENT', 'PROFESSIONAL');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CLIENT';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED');
ALTER TABLE "bookings" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "business_hours" DROP CONSTRAINT "business_hours_profissionalId_fkey";

-- DropForeignKey
ALTER TABLE "holidays" DROP CONSTRAINT "holidays_profissionalId_fkey";

-- DropIndex
DROP INDEX "business_hours_profissionalId_diaSemana_key";

-- DropIndex
DROP INDEX "holidays_profissionalId_data_idx";

-- DropIndex
DROP INDEX "logs_entidade_referencia_idx";

-- DropIndex
DROP INDEX "users_telefone_key";

-- AlterTable
ALTER TABLE "booking_items" DROP COLUMN "duracao",
DROP COLUMN "nome",
DROP COLUMN "preco",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "dataHoraFim",
DROP COLUMN "dataHoraInicio",
DROP COLUMN "observacoes",
DROP COLUMN "pontosUtilizados",
DROP COLUMN "profissionalId",
DROP COLUMN "usuarioId",
DROP COLUMN "valorFinal",
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "pointsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "professionalId" TEXT NOT NULL,
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "business_hours" DROP COLUMN "abreAs",
DROP COLUMN "ativo",
DROP COLUMN "diaSemana",
DROP COLUMN "fechaAs",
DROP COLUMN "pausaFim",
DROP COLUMN "pausaInicio",
DROP COLUMN "profissionalId",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "breakEnd" TEXT,
ADD COLUMN     "breakStart" TEXT,
ADD COLUMN     "closesAt" TEXT NOT NULL,
ADD COLUMN     "dayOfWeek" INTEGER NOT NULL,
ADD COLUMN     "opensAt" TEXT NOT NULL,
ADD COLUMN     "professionalId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "holidays" DROP COLUMN "data",
DROP COLUMN "motivo",
DROP COLUMN "profissionalId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "professionalId" TEXT NOT NULL,
ADD COLUMN     "reason" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "logs" DROP COLUMN "descricao",
DROP COLUMN "entidade",
DROP COLUMN "referencia",
DROP COLUMN "tipo",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "entity" TEXT,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "professionals" DROP COLUMN "ativo",
DROP COLUMN "documento",
DROP COLUMN "especialidade",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "document" TEXT,
ADD COLUMN     "specialty" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "service_professional" DROP COLUMN "duracao",
DROP COLUMN "preco",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "ativo",
DROP COLUMN "categoria",
DROP COLUMN "descricao",
DROP COLUMN "nome",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "nome",
DROP COLUMN "senha",
DROP COLUMN "telefone",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'CLIENT';

-- CreateIndex
CREATE UNIQUE INDEX "business_hours_professionalId_dayOfWeek_key" ON "business_hours"("professionalId", "dayOfWeek");

-- CreateIndex
CREATE INDEX "holidays_professionalId_date_idx" ON "holidays"("professionalId", "date");

-- CreateIndex
CREATE INDEX "logs_entity_reference_idx" ON "logs"("entity", "reference");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- AddForeignKey
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
