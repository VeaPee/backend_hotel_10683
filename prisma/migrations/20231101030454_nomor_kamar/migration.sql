/*
  Warnings:

  - You are about to drop the `DETAIL_KAMAR` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `DETAIL_KAMAR` DROP FOREIGN KEY `DETAIL_KAMAR_kamarId_fkey`;

-- AlterTable
ALTER TABLE `KAMAR` ADD COLUMN `nomor_kamar` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `DETAIL_KAMAR`;
