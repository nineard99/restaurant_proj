/*
  Warnings:

  - You are about to drop the column `number` on the `Table` table. All the data in the column will be lost.
  - Added the required column `name` to the `Table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Table` DROP COLUMN `number`,
    ADD COLUMN `currentOccupancy` INTEGER NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
