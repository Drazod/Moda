/*
  Warnings:

  - You are about to drop the column `cartId` on the `CartItem` table. All the data in the column will be lost.
  - Added the required column `cartItemId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CartItem` DROP FOREIGN KEY `CartItem_cartId_fkey`;

-- DropIndex
DROP INDEX `CartItem_cartId_fkey` ON `CartItem`;

-- AlterTable
ALTER TABLE `Cart` ADD COLUMN `cartItemId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `CartItem` DROP COLUMN `cartId`;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_cartItemId_fkey` FOREIGN KEY (`cartItemId`) REFERENCES `CartItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
