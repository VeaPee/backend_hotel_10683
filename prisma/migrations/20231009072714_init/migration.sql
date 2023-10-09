/*
  Warnings:

  - You are about to drop the column `namaInst` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `noIden` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `noTelp` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `fasilitas_tambahan` table. All the data in the column will be lost.
  - You are about to drop the column `jenis` on the `kamar` table. All the data in the column will be lost.
  - You are about to drop the column `jmlBed` on the `kamar` table. All the data in the column will be lost.
  - You are about to drop the column `anakAnak` on the `reservasi` table. All the data in the column will be lost.
  - You are about to drop the column `dewasa` on the `reservasi` table. All the data in the column will be lost.
  - You are about to drop the column `tanggal` on the `reservasi` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `reservasi` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to drop the column `nama` on the `role` table. All the data in the column will be lost.
  - Added the required column `namaInstitusi` to the `CUSTOMER` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noIdentitas` to the `CUSTOMER` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noTelpon` to the `CUSTOMER` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_fasilitas` to the `FASILITAS_TAMBAHAN` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jenisKamar` to the `KAMAR` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal_reservasi` to the `RESERVASI` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaRole` to the `ROLE` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customer` DROP COLUMN `namaInst`,
    DROP COLUMN `noIden`,
    DROP COLUMN `noTelp`,
    ADD COLUMN `namaInstitusi` VARCHAR(191) NOT NULL,
    ADD COLUMN `noIdentitas` VARCHAR(191) NOT NULL,
    ADD COLUMN `noTelpon` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `fasilitas_tambahan` DROP COLUMN `nama`,
    ADD COLUMN `nama_fasilitas` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `kamar` DROP COLUMN `jenis`,
    DROP COLUMN `jmlBed`,
    ADD COLUMN `jenisKamar` VARCHAR(191) NOT NULL,
    ADD COLUMN `jumlahBed` INTEGER NULL;

-- AlterTable
ALTER TABLE `reservasi` DROP COLUMN `anakAnak`,
    DROP COLUMN `dewasa`,
    DROP COLUMN `tanggal`,
    ADD COLUMN `jumlahAnakAnak` INTEGER NULL,
    ADD COLUMN `jumlahDewasa` INTEGER NULL,
    ADD COLUMN `tanggal_reservasi` DATETIME(3) NOT NULL,
    MODIFY `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `role` DROP COLUMN `nama`,
    ADD COLUMN `namaRole` VARCHAR(191) NOT NULL;
