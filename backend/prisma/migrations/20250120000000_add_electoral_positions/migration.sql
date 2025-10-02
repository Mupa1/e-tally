-- CreateEnum
CREATE TYPE "ElectoralLevel" AS ENUM ('NATIONAL', 'COUNTY', 'CONSTITUENCY', 'WARD');

-- CreateTable
CREATE TABLE "electoral_positions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" "ElectoralLevel" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "electoral_positions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "electoral_positions_name_key" ON "electoral_positions"("name");

-- AlterTable
ALTER TABLE "candidates" ADD COLUMN "electoralPositionId" TEXT;

-- AddForeignKey
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_electoralPositionId_fkey" FOREIGN KEY ("electoralPositionId") REFERENCES "electoral_positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
