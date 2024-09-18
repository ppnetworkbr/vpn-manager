-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clientIdForVpn" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clientIdForVpn_fkey" FOREIGN KEY ("clientIdForVpn") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
