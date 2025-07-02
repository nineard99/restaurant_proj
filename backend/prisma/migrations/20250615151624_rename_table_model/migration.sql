/*
  Warnings:

  - You are about to drop the `Table` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_tableId_fkey`;

-- DropForeignKey
ALTER TABLE `Table` DROP FOREIGN KEY `Table_restaurantId_fkey`;

-- DropIndex
DROP INDEX `Order_tableId_fkey` ON `Order`;

-- DropTable
DROP TABLE `Table`;

-- CreateTable
CREATE TABLE `SeatTable` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `qrCode` VARCHAR(191) NULL,
    `restaurantId` VARCHAR(191) NOT NULL,
    `isOccupied` BOOLEAN NOT NULL DEFAULT false,
    `currentOccupancy` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SeatTable` ADD CONSTRAINT `SeatTable_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_tableId_fkey` FOREIGN KEY (`tableId`) REFERENCES `SeatTable`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
