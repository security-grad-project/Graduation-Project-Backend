-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_deviceId_fkey";

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
