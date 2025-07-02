/*
  Warnings:

  - The values [COOKING,SERVED] on the enum `Orders_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Orders` MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'PAID', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
