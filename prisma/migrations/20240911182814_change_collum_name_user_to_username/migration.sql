/*
  Warnings:

  - You are about to drop the column `user` on the `CoreVpn` table. All the data in the column will be lost.
  - Added the required column `username` to the `CoreVpn` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CoreVpn" DROP COLUMN "user",
ADD COLUMN     "username" TEXT NOT NULL;
