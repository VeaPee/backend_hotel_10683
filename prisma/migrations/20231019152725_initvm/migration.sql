/*
  Warnings:

  - You are about to alter the column `subtotal` on the `DETAIL_RESERVASI_FASILITAS` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `subtotal` on the `DETAIL_RESERVASI_KAMAR` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `harga` on the `FASILITAS_TAMBAHAN` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `tax` on the `NOTA_PELUNASAN` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `subtotal` on the `NOTA_PELUNASAN` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `jaminan` on the `NOTA_PELUNASAN` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `deposit` on the `NOTA_PELUNASAN` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `cash` on the `NOTA_PELUNASAN` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `harga` on the `TARIF` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `DETAIL_RESERVASI_FASILITAS` MODIFY `subtotal` DOUBLE NULL;

-- AlterTable
ALTER TABLE `DETAIL_RESERVASI_KAMAR` MODIFY `subtotal` DOUBLE NULL;

-- AlterTable
ALTER TABLE `FASILITAS_TAMBAHAN` MODIFY `harga` DOUBLE NULL;

-- AlterTable
ALTER TABLE `NOTA_PELUNASAN` MODIFY `tax` DOUBLE NULL,
    MODIFY `subtotal` DOUBLE NULL,
    MODIFY `jaminan` DOUBLE NULL,
    MODIFY `deposit` DOUBLE NULL,
    MODIFY `cash` DOUBLE NULL;

-- AlterTable
ALTER TABLE `TARIF` MODIFY `harga` DOUBLE NULL;
