-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_deviceId_fkey";

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "mitre" TEXT[],
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "source" TEXT,
ALTER COLUMN "deviceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;
