-- AlterTable
ALTER TABLE `User` ADD COLUMN `privateKeyHash` VARCHAR(64) NULL,
    ADD COLUMN `publicKey` TEXT NULL;
