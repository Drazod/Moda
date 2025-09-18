-- DropIndex
DROP INDEX `User_phone_key` ON `User`;

-- CreateTable
CREATE TABLE `Size` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `clothesId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feature` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(191) NOT NULL,
    `clothesId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Size` ADD CONSTRAINT `Size_clothesId_fkey` FOREIGN KEY (`clothesId`) REFERENCES `Clothes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feature` ADD CONSTRAINT `Feature_clothesId_fkey` FOREIGN KEY (`clothesId`) REFERENCES `Clothes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
