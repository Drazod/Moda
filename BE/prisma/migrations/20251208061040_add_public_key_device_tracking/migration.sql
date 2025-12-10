-- AlterTable
ALTER TABLE `User` ADD COLUMN `publicKeyDevice` VARCHAR(255) NULL,
    ADD COLUMN `publicKeyUpdatedAt` DATETIME(3) NULL;
