-- CreateTable
CREATE TABLE `RecoveryCodeWrap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `codeHash` VARCHAR(64) NOT NULL,
    `wrappedMasterKey` TEXT NOT NULL,
    `wrapIV` VARCHAR(255) NOT NULL,
    `isUsed` BOOLEAN NOT NULL DEFAULT false,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `RecoveryCodeWrap_userId_idx`(`userId`),
    INDEX `RecoveryCodeWrap_codeHash_idx`(`codeHash`),
    UNIQUE INDEX `RecoveryCodeWrap_userId_codeHash_key`(`userId`, `codeHash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `publicKeyDevice`,
    ADD COLUMN `masterKeyWrappedByPin` TEXT NULL,
    ADD COLUMN `pinWrapIV` VARCHAR(255) NULL,
    ADD COLUMN `publicKeyDevices` JSON NULL;

-- AddForeignKey
ALTER TABLE `RecoveryCodeWrap` ADD CONSTRAINT `RecoveryCodeWrap_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
