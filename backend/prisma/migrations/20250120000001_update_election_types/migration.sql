-- DropEnum
DROP TYPE IF EXISTS "ElectionType";

-- CreateEnum
CREATE TYPE "ElectionType" AS ENUM ('GENERAL_ELECTION', 'RUNOFF_ELECTION', 'BY_ELECTIONS', 'PRIMARY_ELECTIONS');

-- AlterTable
ALTER TABLE "candidates" DROP COLUMN "electionType";

-- AlterTable
ALTER TABLE "election_results" ADD COLUMN "electionType" "ElectionType" NOT NULL DEFAULT 'GENERAL_ELECTION';
