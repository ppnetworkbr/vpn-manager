/*
  Warnings:

  - You are about to drop the column `ip` on the `clientNetworks` table. All the data in the column will be lost.
  - You are about to drop the column `mask` on the `clientNetworks` table. All the data in the column will be lost.
  - Added the required column `network` to the `clientNetworks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clientNetworks" DROP COLUMN "ip",
DROP COLUMN "mask",
ADD COLUMN     "network" TEXT NOT NULL;
