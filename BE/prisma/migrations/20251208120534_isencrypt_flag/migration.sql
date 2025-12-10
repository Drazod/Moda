/*
  Warnings:

  - You are about to drop the column `privateKeyHash` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Message` ADD COLUMN `isEncrypted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `privateKeyHash`;
