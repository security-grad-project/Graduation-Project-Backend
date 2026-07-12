-- CreateEnum
CREATE TYPE "crdb_internal_region" AS ENUM ('aws-eu-central-1');

-- CreateTable
CREATE TABLE "HuntingQuery" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "esql" TEXT NOT NULL,
    "kql" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HuntingQuery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HuntingQuery_name_key" ON "HuntingQuery"("name");
