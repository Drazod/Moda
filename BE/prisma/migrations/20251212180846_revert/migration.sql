/*
  Warnings:

  - You are about to drop the column `tokensReturned` on the `Refund` table. All the data in the column will be lost.
  - You are about to drop the `C2CListing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `C2CReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `C2CTrade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CashoutRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OnchainTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WalletAddress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pointsReturned` to the `Refund` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `C2CListing` DROP FOREIGN KEY `C2CListing_clothesId_fkey`;

-- DropForeignKey
ALTER TABLE `C2CListing` DROP FOREIGN KEY `C2CListing_sellerId_fkey`;

-- DropForeignKey
ALTER TABLE `C2CReview` DROP FOREIGN KEY `C2CReview_revieweeId_fkey`;

-- DropForeignKey
ALTER TABLE `C2CReview` DROP FOREIGN KEY `C2CReview_reviewerId_fkey`;

-- DropForeignKey
ALTER TABLE `C2CReview` DROP FOREIGN KEY `C2CReview_tradeId_fkey`;

-- DropForeignKey
ALTER TABLE `C2CTrade` DROP FOREIGN KEY `C2CTrade_buyerId_fkey`;

-- DropForeignKey
ALTER TABLE `C2CTrade` DROP FOREIGN KEY `C2CTrade_listingId_fkey`;

-- DropForeignKey
ALTER TABLE `C2CTrade` DROP FOREIGN KEY `C2CTrade_sellerId_fkey`;

-- DropForeignKey
ALTER TABLE `CashoutRequest` DROP FOREIGN KEY `CashoutRequest_userId_fkey`;

-- DropForeignKey
ALTER TABLE `OnchainTransaction` DROP FOREIGN KEY `OnchainTransaction_userId_fkey`;

-- DropForeignKey
ALTER TABLE `WalletAddress` DROP FOREIGN KEY `WalletAddress_userId_fkey`;

-- AlterTable
ALTER TABLE `Refund` DROP COLUMN `tokensReturned`,
    ADD COLUMN `pointsReturned` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `points` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `C2CListing`;

-- DropTable
DROP TABLE `C2CReview`;

-- DropTable
DROP TABLE `C2CTrade`;

-- DropTable
DROP TABLE `CashoutRequest`;

-- DropTable
DROP TABLE `OnchainTransaction`;

-- DropTable
DROP TABLE `WalletAddress`;

-- CreateTable
CREATE TABLE `PointHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `points` INTEGER NOT NULL,
    `type` ENUM('EARNED_PAYMENT', 'RETURNED_REFUND', 'SPENT_PURCHASE', 'ADMIN_ADJUSTMENT') NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `transactionId` INTEGER NULL,
    `refundId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PointHistory` ADD CONSTRAINT `PointHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
