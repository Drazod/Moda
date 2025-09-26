-- DropForeignKey
ALTER TABLE `Notice` DROP FOREIGN KEY `Notice_userId_fkey`;

-- DropIndex
DROP INDEX `Notice_userId_fkey` ON `Notice`;

-- AlterTable
ALTER TABLE `Notice` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Notice` ADD CONSTRAINT `Notice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
