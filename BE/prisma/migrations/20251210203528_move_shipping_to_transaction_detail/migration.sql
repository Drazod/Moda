/*
  Warnings:

  - You are about to drop the column `pickupBranchId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `transId` on the `Shipping` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionDetailId]` on the table `Shipping` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionDetailId` to the `Shipping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Shipping` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_pickupBranchId_fkey`;

-- DropForeignKey
ALTER TABLE `Shipping` DROP FOREIGN KEY `Shipping_transId_fkey`;

-- DropIndex
DROP INDEX `Cart_pickupBranchId_fkey` ON `Cart`;

-- DropIndex
DROP INDEX `Shipping_transId_key` ON `Shipping`;

-- AlterTable
ALTER TABLE `Cart` DROP COLUMN `pickupBranchId`;

-- AlterTable
ALTER TABLE `Message` ADD COLUMN `aesKey` VARCHAR(512) NULL,
    ADD COLUMN `encryptedAESKey` TEXT NULL,
    ADD COLUMN `encryptedContent` TEXT NULL,
    ADD COLUMN `iv` VARCHAR(512) NULL;

-- AlterTable
ALTER TABLE `Shipping` DROP COLUMN `transId`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `transactionDetailId` INTEGER NOT NULL,
    ADD COLUMN `type` ENUM('SHIP', 'PICKUP') NOT NULL DEFAULT 'SHIP',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `encryptedPrivateKey` TEXT NULL,
    ADD COLUMN `privateKeyIV` VARCHAR(255) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Shipping_transactionDetailId_key` ON `Shipping`(`transactionDetailId`);

-- AddForeignKey
ALTER TABLE `Shipping` ADD CONSTRAINT `Shipping_transactionDetailId_fkey` FOREIGN KEY (`transactionDetailId`) REFERENCES `TransactionDetail`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
