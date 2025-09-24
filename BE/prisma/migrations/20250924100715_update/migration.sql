-- DropForeignKey
ALTER TABLE `Feature` DROP FOREIGN KEY `Feature_clothesId_fkey`;

-- DropForeignKey
ALTER TABLE `Size` DROP FOREIGN KEY `Size_clothesId_fkey`;

-- DropIndex
DROP INDEX `Feature_clothesId_fkey` ON `Feature`;

-- DropIndex
DROP INDEX `Size_clothesId_fkey` ON `Size`;

-- AlterTable
ALTER TABLE `Cart` MODIFY `state` ENUM('ORDERED', 'PENDING', 'SHIPPING', 'COMPLETE') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `Shipping` MODIFY `State` ENUM('ORDERED', 'PENDING', 'SHIPPING', 'COMPLETE') NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `Notice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `content` VARCHAR(191) NOT NULL,
    `imageId` INTEGER NULL,
    `pages` JSON NOT NULL,
    `state` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Size` ADD CONSTRAINT `Size_clothesId_fkey` FOREIGN KEY (`clothesId`) REFERENCES `Clothes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feature` ADD CONSTRAINT `Feature_clothesId_fkey` FOREIGN KEY (`clothesId`) REFERENCES `Clothes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notice` ADD CONSTRAINT `Notice_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Image`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
