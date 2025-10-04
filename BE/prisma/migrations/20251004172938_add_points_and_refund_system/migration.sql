-- AlterTable
ALTER TABLE `TransactionDetail` ADD COLUMN `refundedQuantity` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `points` INTEGER NOT NULL DEFAULT 0;

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

-- CreateTable
CREATE TABLE `Refund` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `transactionDetailId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `refundAmount` DOUBLE NOT NULL,
    `pointsReturned` INTEGER NOT NULL,
    `reason` VARCHAR(1024) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    `adminNote` VARCHAR(1024) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PointHistory` ADD CONSTRAINT `PointHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_transactionDetailId_fkey` FOREIGN KEY (`transactionDetailId`) REFERENCES `TransactionDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
