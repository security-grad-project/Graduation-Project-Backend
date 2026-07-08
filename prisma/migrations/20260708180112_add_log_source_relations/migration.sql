-- AlterTable
ALTER TABLE "Rule" ADD COLUMN     "logSourceId" TEXT,
ADD COLUMN     "mitreTactics" TEXT[];

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_logSourceId_fkey" FOREIGN KEY ("logSourceId") REFERENCES "LogSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
