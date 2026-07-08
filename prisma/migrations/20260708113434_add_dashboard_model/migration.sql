-- CreateTable
CREATE TABLE "Dashboard" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[],
    "ownerId" TEXT NOT NULL,
    "panels" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Dashboard_ownerId_idx" ON "Dashboard"("ownerId");

-- CreateIndex
CREATE INDEX "Dashboard_createdAt_idx" ON "Dashboard"("createdAt");

-- CreateIndex
CREATE INDEX "Dashboard_title_idx" ON "Dashboard"("title");

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Analyst"("id") ON DELETE CASCADE ON UPDATE CASCADE;
