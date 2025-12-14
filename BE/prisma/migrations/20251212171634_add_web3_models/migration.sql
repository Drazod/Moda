/*
  Warnings:

  - You are about to drop the column `pointsReturned` on the `Refund` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `PointHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `PointHistory` DROP FOREIGN KEY `PointHistory_userId_fkey`;

-- AlterTable
ALTER TABLE `Refund` DROP COLUMN `pointsReturned`,
    ADD COLUMN `tokensReturned` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `points`;

-- DropTable
DROP TABLE `PointHistory`;

-- CreateTable
CREATE TABLE `WalletAddress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `address` VARCHAR(42) NOT NULL,
    `chain` VARCHAR(191) NOT NULL DEFAULT 'POLYGON',
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `verifiedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `WalletAddress_address_idx`(`address`),
    INDEX `WalletAddress_userId_isPrimary_idx`(`userId`, `isPrimary`),
    UNIQUE INDEX `WalletAddress_userId_address_key`(`userId`, `address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OnchainTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `txHash` VARCHAR(66) NOT NULL,
    `type` ENUM('MINT', 'BURN', 'ESCROW_DEPOSIT', 'ESCROW_RELEASE', 'ESCROW_REFUND', 'TRANSFER') NOT NULL,
    `fromAddress` VARCHAR(42) NOT NULL,
    `toAddress` VARCHAR(42) NOT NULL,
    `amount` VARCHAR(78) NOT NULL,
    `tokenAddress` VARCHAR(42) NOT NULL,
    `blockNumber` INTEGER NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `confirmedAt` DATETIME(3) NULL,

    UNIQUE INDEX `OnchainTransaction_txHash_key`(`txHash`),
    INDEX `OnchainTransaction_userId_idx`(`userId`),
    INDEX `OnchainTransaction_txHash_idx`(`txHash`),
    INDEX `OnchainTransaction_status_idx`(`status`),
    INDEX `OnchainTransaction_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `C2CListing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sellerId` INTEGER NOT NULL,
    `clothesId` INTEGER NOT NULL,
    `priceInTokens` DECIMAL(36, 18) NOT NULL,
    `condition` ENUM('NEW', 'LIKE_NEW', 'GOOD', 'FAIR') NOT NULL,
    `description` TEXT NULL,
    `images` JSON NULL,
    `status` ENUM('ACTIVE', 'PENDING', 'SOLD', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `C2CListing_sellerId_idx`(`sellerId`),
    INDEX `C2CListing_clothesId_idx`(`clothesId`),
    INDEX `C2CListing_status_idx`(`status`),
    INDEX `C2CListing_priceInTokens_idx`(`priceInTokens`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `C2CTrade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listingId` INTEGER NOT NULL,
    `buyerId` INTEGER NOT NULL,
    `sellerId` INTEGER NOT NULL,
    `priceInTokens` DECIMAL(36, 18) NOT NULL,
    `status` ENUM('PENDING_DEPOSIT', 'ESCROWED', 'DELIVERED', 'COMPLETED', 'DISPUTED', 'REFUNDED', 'CANCELLED') NOT NULL DEFAULT 'PENDING_DEPOSIT',
    `buyerWallet` VARCHAR(42) NOT NULL,
    `sellerWallet` VARCHAR(42) NOT NULL,
    `escrowTxHash` VARCHAR(66) NULL,
    `deliveryTxHash` VARCHAR(66) NULL,
    `completionTxHash` VARCHAR(66) NULL,
    `trackingNumber` VARCHAR(100) NULL,
    `disputeReason` TEXT NULL,
    `disputeEvidence` JSON NULL,
    `disputeOpenedBy` INTEGER NULL,
    `disputeOpenedAt` DATETIME(3) NULL,
    `resolvedBy` INTEGER NULL,
    `resolvedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `escrowedAt` DATETIME(3) NULL,
    `deliveredAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `C2CTrade_listingId_idx`(`listingId`),
    INDEX `C2CTrade_buyerId_idx`(`buyerId`),
    INDEX `C2CTrade_sellerId_idx`(`sellerId`),
    INDEX `C2CTrade_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `C2CReview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tradeId` INTEGER NOT NULL,
    `reviewerId` INTEGER NOT NULL,
    `revieweeId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `C2CReview_revieweeId_idx`(`revieweeId`),
    INDEX `C2CReview_rating_idx`(`rating`),
    UNIQUE INDEX `C2CReview_tradeId_reviewerId_key`(`tradeId`, `reviewerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CashoutRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `amountInTokens` VARCHAR(78) NOT NULL,
    `amountInFiat` DECIMAL(10, 2) NOT NULL,
    `fiatCurrency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `bankAccount` VARCHAR(255) NOT NULL,
    `bankName` VARCHAR(100) NOT NULL,
    `burnTxHash` VARCHAR(66) NULL,
    `status` ENUM('PENDING', 'VERIFIED_DEPOSIT', 'PROCESSING_FIAT', 'COMPLETED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `adminNotes` TEXT NULL,
    `processedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `burnedAt` DATETIME(3) NULL,
    `fiatTransferredAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CashoutRequest_userId_idx`(`userId`),
    INDEX `CashoutRequest_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WalletAddress` ADD CONSTRAINT `WalletAddress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnchainTransaction` ADD CONSTRAINT `OnchainTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CListing` ADD CONSTRAINT `C2CListing_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CListing` ADD CONSTRAINT `C2CListing_clothesId_fkey` FOREIGN KEY (`clothesId`) REFERENCES `Clothes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CTrade` ADD CONSTRAINT `C2CTrade_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `C2CListing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CTrade` ADD CONSTRAINT `C2CTrade_buyerId_fkey` FOREIGN KEY (`buyerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CTrade` ADD CONSTRAINT `C2CTrade_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CReview` ADD CONSTRAINT `C2CReview_tradeId_fkey` FOREIGN KEY (`tradeId`) REFERENCES `C2CTrade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CReview` ADD CONSTRAINT `C2CReview_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CReview` ADD CONSTRAINT `C2CReview_revieweeId_fkey` FOREIGN KEY (`revieweeId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CashoutRequest` ADD CONSTRAINT `CashoutRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
