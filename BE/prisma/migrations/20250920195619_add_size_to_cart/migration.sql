/*
  Warnings:

  - Added the required column `sizeId` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CartItem` ADD COLUMN `sizeId` INTEGER NULL;
UPDATE `CartItem` SET `sizeId` = 1 WHERE `sizeId` IS NULL;
ALTER TABLE `CartItem` MODIFY COLUMN `sizeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `Size`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
