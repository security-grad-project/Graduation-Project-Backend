/*
  Warnings:

  - You are about to drop the column `port` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Device` table. All the data in the column will be lost.
  - Added the required column `port` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_userId_fkey";

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "port",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "port" INTEGER NOT NULL;
