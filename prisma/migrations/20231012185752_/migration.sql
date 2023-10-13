/*
  Warnings:

  - You are about to alter the column `subtotal` on the `detail_reservasi_fasilitas` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `subtotal` on the `detail_reservasi_kamar` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `harga` on the `fasilitas_tambahan` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `tax` on the `nota_pelunasan` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `subtotal` on the `nota_pelunasan` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `jaminan` on the `nota_pelunasan` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `deposit` on the `nota_pelunasan` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `cash` on the `nota_pelunasan` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `harga` on the `tarif` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `detail_reservasi_fasilitas` MODIFY `subtotal` DOUBLE NULL;

-- AlterTable
ALTER TABLE `detail_reservasi_kamar` MODIFY `subtotal` DOUBLE NULL;

-- AlterTable
ALTER TABLE `fasilitas_tambahan` MODIFY `harga` DOUBLE NULL;

-- AlterTable
ALTER TABLE `nota_pelunasan` MODIFY `tax` DOUBLE NULL,
    MODIFY `subtotal` DOUBLE NULL,
    MODIFY `jaminan` DOUBLE NULL,
    MODIFY `deposit` DOUBLE NULL,
    MODIFY `cash` DOUBLE NULL;

-- AlterTable
ALTER TABLE `tarif` MODIFY `harga` DOUBLE NULL;
