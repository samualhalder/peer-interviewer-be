-- CreateTable
CREATE TABLE "InterviewRequests" (
    "id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewRequests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InterviewRequests" ADD CONSTRAINT "InterviewRequests_from_fkey" FOREIGN KEY ("from") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewRequests" ADD CONSTRAINT "InterviewRequests_to_fkey" FOREIGN KEY ("to") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
