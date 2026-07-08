-- CreateTable
CREATE TABLE "LogSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dataset" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'logs',
    "index" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "agentVersion" TEXT NOT NULL DEFAULT '9.2.1',
    "pipeline" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'ECS',
    "retentionDays" INTEGER NOT NULL DEFAULT 90,
    "ilmPolicy" TEXT NOT NULL DEFAULT 'logs-90d',
    "shards" INTEGER NOT NULL DEFAULT 1,
    "owner" TEXT NOT NULL DEFAULT 'SOC Team',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LogSource_name_key" ON "LogSource"("name");
