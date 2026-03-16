/*
  Warnings:

  - You are about to drop the column `roomID` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `roomId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_roomID_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "roomID",
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
