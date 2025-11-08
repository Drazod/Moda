/*
  Warnings:

  - A unique constraint covering the columns `[managerId]` on the table `Branch` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Branch` ADD COLUMN `managerId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Branch_managerId_key` ON `Branch`(`managerId`);

-- AddForeignKey
ALTER TABLE `Branch` ADD CONSTRAINT `Branch_managerId_fkey` FOREIGN KEY (`managerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
