-- AlterTable
ALTER TABLE `project` ADD COLUMN `status` ENUM('ACTIVE', 'COMPLETED', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX `Project_status_idx` ON `Project`(`status`);
