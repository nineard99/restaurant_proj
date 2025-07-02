/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Table` MODIFY `qrCode` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `role`,
    ADD COLUMN `Role` ENUM('DEV', 'SUPERADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER';
