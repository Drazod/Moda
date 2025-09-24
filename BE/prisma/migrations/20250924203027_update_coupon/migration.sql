/*
  Warnings:

  - You are about to drop the column `code` on the `Coupon` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[couponCode]` on the table `Coupon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `couponCode` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_couponCode_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_code_fkey`;

-- DropIndex
DROP INDEX `Coupon_code_key` ON `Coupon`;

-- DropIndex
DROP INDEX `Transaction_couponCode_fkey` ON `Transaction`;

-- DropIndex
DROP INDEX `User_code_key` ON `User`;

-- AlterTable
ALTER TABLE `Coupon` DROP COLUMN `code`,
    ADD COLUMN `couponCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `code`;

-- CreateIndex
CREATE UNIQUE INDEX `Coupon_couponCode_key` ON `Coupon`(`couponCode`);

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_couponCode_fkey` FOREIGN KEY (`couponCode`) REFERENCES `Coupon`(`couponCode`) ON DELETE SET NULL ON UPDATE CASCADE;
