/*
  Warnings:

  - A unique constraint covering the columns `[vpnIp]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client_vpnIp_key" ON "Client"("vpnIp");
