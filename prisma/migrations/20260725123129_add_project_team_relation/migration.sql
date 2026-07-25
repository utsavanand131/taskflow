-- AlterTable
ALTER TABLE `project` ADD COLUMN `teamId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Project_teamId_idx` ON `Project`(`teamId`);

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
