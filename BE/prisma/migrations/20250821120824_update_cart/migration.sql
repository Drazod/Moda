/*
  Warnings:

  - A unique constraint covering the columns `[couponCode]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Cart` ADD COLUMN `couponCode` VARCHAR(191) NULL,
    ADD COLUMN `listClothes` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `transactionId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Cart_couponCode_key` ON `Cart`(`couponCode`);

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_couponCode_fkey` FOREIGN KEY (`couponCode`) REFERENCES `Coupon`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
