-- CreateTable
CREATE TABLE `PasswordHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `previousPassword` VARCHAR(1024) NOT NULL,
    `rollbackToken` VARCHAR(191) NOT NULL,
    `tokenExpiry` DATETIME(3) NOT NULL,
    `isUsed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PasswordHistory_rollbackToken_key`(`rollbackToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PasswordHistory` ADD CONSTRAINT `PasswordHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
