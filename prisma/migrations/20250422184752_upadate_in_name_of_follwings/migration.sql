/*
  Warnings:

  - You are about to drop the column `totalFollowed` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "totalFollowed",
ADD COLUMN     "noOfFollowings" INTEGER NOT NULL DEFAULT 0;
