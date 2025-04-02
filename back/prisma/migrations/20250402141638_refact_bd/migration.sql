/*
  Warnings:

  - You are about to drop the column `dataHora` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `validatedAt` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `professionals` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `professionals` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `professionals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dataHoraFim` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataHoraInicio` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `professionals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `professionals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profissionalId` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "dataHora",
DROP COLUMN "validatedAt",
ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "dataHoraFim" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataHoraInicio" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "observacoes" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "valorFinal" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "professionals" DROP COLUMN "nome",
DROP COLUMN "telefone",
ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "documento" TEXT,
ADD COLUMN     "intervalosAgendamento" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "registro" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "categoria" TEXT,
ADD COLUMN     "profissionalId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "business_hours" (
    "id" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "abreAs" TEXT NOT NULL,
    "fechaAs" TEXT NOT NULL,
    "pausaInicio" TEXT,
    "pausaFim" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "business_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holidays" (
    "id" TEXT NOT NULL,
    "profissionalId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_hours_profissionalId_diaSemana_key" ON "business_hours"("profissionalId", "diaSemana");

-- CreateIndex
CREATE INDEX "holidays_profissionalId_data_idx" ON "holidays"("profissionalId", "data");

-- CreateIndex
CREATE INDEX "bookings_usuarioId_dataHoraInicio_idx" ON "bookings"("usuarioId", "dataHoraInicio");

-- CreateIndex
CREATE INDEX "bookings_profissionalId_dataHoraInicio_idx" ON "bookings"("profissionalId", "dataHoraInicio");

-- CreateIndex
CREATE UNIQUE INDEX "professionals_userId_key" ON "professionals"("userId");

-- AddForeignKey
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_hours" ADD CONSTRAINT "business_hours_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holidays" ADD CONSTRAINT "holidays_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
