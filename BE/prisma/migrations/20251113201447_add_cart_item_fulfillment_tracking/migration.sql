-- AlterTable
ALTER TABLE `CartItem` ADD COLUMN `allocationNote` VARCHAR(512) NULL,
    ADD COLUMN `estimatedDate` DATETIME(3) NULL,
    ADD COLUMN `fulfillmentMethod` VARCHAR(191) NOT NULL DEFAULT 'ship',
    ADD COLUMN `needsTransfer` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pickupBranchId` INTEGER NULL,
    ADD COLUMN `sourceBranchId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_sourceBranchId_fkey` FOREIGN KEY (`sourceBranchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_pickupBranchId_fkey` FOREIGN KEY (`pickupBranchId`) REFERENCES `Branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
