/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Rule` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_ruleId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Rule_name_key" ON "Rule"("name");

-- CreateIndex
CREATE INDEX "Rule_type_idx" ON "Rule"("type");

-- CreateIndex
CREATE INDEX "Rule_createdAt_idx" ON "Rule"("createdAt");

-- CreateIndex
CREATE INDEX "Rule_name_idx" ON "Rule"("name");

-- CreateIndex
CREATE INDEX "Rule_type_createdAt_idx" ON "Rule"("type", "createdAt");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
