/*
  Warnings:

  - You are about to drop the column `ClothesId` on the `Comment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,transactionDetailId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionDetailId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_ClothesId_fkey`;

-- DropIndex
DROP INDEX `Comment_ClothesId_fkey` ON `Comment`;

-- AlterTable
ALTER TABLE `Comment` DROP COLUMN `ClothesId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isVerifiedPurchase` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `transactionDetailId` INTEGER NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Comment_userId_transactionDetailId_key` ON `Comment`(`userId`, `transactionDetailId`);

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_transactionDetailId_fkey` FOREIGN KEY (`transactionDetailId`) REFERENCES `TransactionDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
