-- CreateTable
CREATE TABLE `C2CListing` (
    `id` VARCHAR(191) NOT NULL,
    `sellerId` INTEGER NOT NULL,
    `clothesId` INTEGER NOT NULL,
    `sizeId` INTEGER NULL,
    `condition` ENUM('NEW', 'LIKE_NEW', 'GOOD', 'FAIR') NOT NULL,
    `description` TEXT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('ACTIVE', 'RESERVED', 'SOLD', 'CANCELLED', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `C2CListing_sellerId_idx`(`sellerId`),
    INDEX `C2CListing_clothesId_idx`(`clothesId`),
    INDEX `C2CListing_sizeId_idx`(`sizeId`),
    INDEX `C2CListing_status_idx`(`status`),
    INDEX `C2CListing_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ListingImage` (
    `id` VARCHAR(191) NOT NULL,
    `listingId` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(512) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ListingImage_listingId_idx`(`listingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `C2CTrade` (
    `id` VARCHAR(191) NOT NULL,
    `listingId` VARCHAR(191) NOT NULL,
    `buyerId` INTEGER NOT NULL,
    `sellerId` INTEGER NOT NULL,
    `agreedPrice` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('INITIATED', 'PAYMENT_PENDING', 'PAYMENT_CONFIRMED', 'SHIPPING', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'DISPUTED', 'DISPUTE_RESOLVED') NOT NULL DEFAULT 'INITIATED',
    `paymentMethod` ENUM('VNPAY', 'MOMO', 'WALLET_TOKENS', 'BANK_TRANSFER', 'CASH_ON_DELIVERY', 'OTHER') NULL,
    `paymentAmount` DECIMAL(10, 2) NULL,
    `paidAt` DATETIME(3) NULL,
    `paymentConfirmedAt` DATETIME(3) NULL,
    `paymentProof` TEXT NULL,
    `deliveryMethod` ENUM('SHIP', 'MEETUP', 'OTHER') NULL,
    `deliveryAddress` TEXT NULL,
    `shippingFee` DECIMAL(10, 2) NULL,
    `shippedAt` DATETIME(3) NULL,
    `deliveredAt` DATETIME(3) NULL,
    `deliveryProof` TEXT NULL,
    `autoCompleteAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `disputedAt` DATETIME(3) NULL,
    `disputeReason` TEXT NULL,
    `disputeResolvedAt` DATETIME(3) NULL,
    `resolutionNote` TEXT NULL,
    `cancelledAt` DATETIME(3) NULL,
    `cancelReason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `C2CTrade_listingId_idx`(`listingId`),
    INDEX `C2CTrade_buyerId_idx`(`buyerId`),
    INDEX `C2CTrade_sellerId_idx`(`sellerId`),
    INDEX `C2CTrade_status_idx`(`status`),
    INDEX `C2CTrade_autoCompleteAt_idx`(`autoCompleteAt`),
    INDEX `C2CTrade_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `C2CTradeMessage` (
    `id` VARCHAR(191) NOT NULL,
    `tradeId` VARCHAR(191) NOT NULL,
    `senderId` INTEGER NOT NULL,
    `type` ENUM('TEXT', 'SYSTEM', 'PAYMENT_PROOF', 'DELIVERY_PROOF') NOT NULL DEFAULT 'TEXT',
    `content` TEXT NOT NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `C2CTradeMessage_tradeId_idx`(`tradeId`),
    INDEX `C2CTradeMessage_senderId_idx`(`senderId`),
    INDEX `C2CTradeMessage_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `C2CReview` (
    `id` VARCHAR(191) NOT NULL,
    `tradeId` VARCHAR(191) NOT NULL,
    `reviewerId` INTEGER NOT NULL,
    `revieweeId` INTEGER NOT NULL,
    `role` ENUM('BUYER', 'SELLER') NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `C2CReview_reviewerId_idx`(`reviewerId`),
    INDEX `C2CReview_revieweeId_idx`(`revieweeId`),
    INDEX `C2CReview_tradeId_idx`(`tradeId`),
    UNIQUE INDEX `C2CReview_tradeId_reviewerId_key`(`tradeId`, `reviewerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `C2CReputation` (
    `id` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `role` ENUM('BUYER', 'SELLER') NOT NULL,
    `averageRating` DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
    `totalRatings` INTEGER NOT NULL DEFAULT 0,
    `totalTrades` INTEGER NOT NULL DEFAULT 0,
    `completedTrades` INTEGER NOT NULL DEFAULT 0,
    `disputedTrades` INTEGER NOT NULL DEFAULT 0,
    `cancelledTrades` INTEGER NOT NULL DEFAULT 0,
    `completionRate` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `disputeRate` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `responseTimeAvg` INTEGER NULL,
    `lastCalculatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `C2CReputation_userId_idx`(`userId`),
    INDEX `C2CReputation_role_idx`(`role`),
    INDEX `C2CReputation_averageRating_idx`(`averageRating`),
    UNIQUE INDEX `C2CReputation_userId_role_key`(`userId`, `role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `C2CListing` ADD CONSTRAINT `C2CListing_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CListing` ADD CONSTRAINT `C2CListing_clothesId_fkey` FOREIGN KEY (`clothesId`) REFERENCES `Clothes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CListing` ADD CONSTRAINT `C2CListing_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `Size`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ListingImage` ADD CONSTRAINT `ListingImage_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `C2CListing`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CTrade` ADD CONSTRAINT `C2CTrade_listingId_fkey` FOREIGN KEY (`listingId`) REFERENCES `C2CListing`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CTrade` ADD CONSTRAINT `C2CTrade_buyerId_fkey` FOREIGN KEY (`buyerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CTrade` ADD CONSTRAINT `C2CTrade_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CTradeMessage` ADD CONSTRAINT `C2CTradeMessage_tradeId_fkey` FOREIGN KEY (`tradeId`) REFERENCES `C2CTrade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CTradeMessage` ADD CONSTRAINT `C2CTradeMessage_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CReview` ADD CONSTRAINT `C2CReview_tradeId_fkey` FOREIGN KEY (`tradeId`) REFERENCES `C2CTrade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CReview` ADD CONSTRAINT `C2CReview_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CReview` ADD CONSTRAINT `C2CReview_revieweeId_fkey` FOREIGN KEY (`revieweeId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `C2CReputation` ADD CONSTRAINT `C2CReputation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
