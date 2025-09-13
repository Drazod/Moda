-- DropForeignKey
ALTER TABLE `Image` DROP FOREIGN KEY `Image_id_fkey`;

-- CreateTable
CREATE TABLE `_ExtraImages` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ExtraImages_AB_unique`(`A`, `B`),
    INDEX `_ExtraImages_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ExtraImages` ADD CONSTRAINT `_ExtraImages_A_fkey` FOREIGN KEY (`A`) REFERENCES `Clothes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExtraImages` ADD CONSTRAINT `_ExtraImages_B_fkey` FOREIGN KEY (`B`) REFERENCES `Image`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
