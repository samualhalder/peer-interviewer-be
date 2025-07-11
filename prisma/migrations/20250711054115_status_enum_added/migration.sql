/*
  Warnings:

  - The `status` column on the `InterviewRequests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'accepted', 'completed', 'canceled');

-- AlterTable
ALTER TABLE "InterviewRequests" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'pending';
