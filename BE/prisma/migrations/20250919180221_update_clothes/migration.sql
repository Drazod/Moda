-- AlterTable
ALTER TABLE `Clothes` ADD COLUMN `information` VARCHAR(1024) NULL,
    ADD COLUMN `material` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `address` DROP DEFAULT;
