/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `User` table. All the data in the column will be lost.
  - The values [BRANCHMANAGER,EMPLOYEE] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_restaurantId_fkey`;

-- DropIndex
DROP INDEX `User_restaurantId_fkey` ON `User`;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `restaurantId`,
    MODIFY `role` ENUM('DEV', 'SUPERADMIN', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER';

-- CreateTable
CREATE TABLE `RestaurantUser` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `restaurantId` VARCHAR(191) NOT NULL,
    `role` ENUM('OWNER', 'MANAGER', 'EMPLOYEE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RestaurantUser` ADD CONSTRAINT `RestaurantUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RestaurantUser` ADD CONSTRAINT `RestaurantUser_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
