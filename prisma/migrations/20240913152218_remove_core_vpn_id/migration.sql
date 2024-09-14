/*
  Warnings:

  - You are about to drop the column `coreVpnId` on the `Client` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_coreVpnId_fkey";

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "coreVpnId";
