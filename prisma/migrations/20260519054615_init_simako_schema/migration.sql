-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` ENUM('PENYEWA', 'MITRA', 'ADMIN') NOT NULL,
    `label` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `roleId` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `isSuspended` BOOLEAN NOT NULL DEFAULT false,
    `suspendedAt` DATETIME(3) NULL,
    `suspendNote` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `avatarAssetId` CHAR(36) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_avatarAssetId_key`(`avatarAssetId`),
    INDEX `users_roleId_idx`(`roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profiles` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `namaLengkap` VARCHAR(191) NOT NULL,
    `telepon` VARCHAR(20) NULL,
    `alamat` TEXT NULL,
    `tanggalLahir` DATETIME(3) NULL,
    `jenisKelamin` VARCHAR(20) NULL,
    `kampusId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_profiles_userId_key`(`userId`),
    INDEX `user_profiles_kampusId_idx`(`kampusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `owner_profiles` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `namaUsaha` VARCHAR(191) NULL,
    `namaBank` VARCHAR(100) NULL,
    `rekeningNo` VARCHAR(50) NULL,
    `rekeningNama` VARCHAR(191) NULL,
    `kycStatus` ENUM('BELUM_UPLOAD', 'MENUNGGU', 'DISETUJUI', 'DITOLAK') NOT NULL DEFAULT 'BELUM_UPLOAD',
    `kycNote` VARCHAR(500) NULL,
    `kycVerifiedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `ktpAssetId` CHAR(36) NULL,

    UNIQUE INDEX `owner_profiles_userId_key`(`userId`),
    UNIQUE INDEX `owner_profiles_ktpAssetId_key`(`ktpAssetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_settings` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `notifEmail` BOOLEAN NOT NULL DEFAULT true,
    `notifWhatsapp` BOOLEAN NOT NULL DEFAULT false,
    `notifPembayaran` BOOLEAN NOT NULL DEFAULT true,
    `notifBroadcast` BOOLEAN NOT NULL DEFAULT true,
    `bahasa` VARCHAR(10) NOT NULL DEFAULT 'id',

    UNIQUE INDEX `user_settings_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `active_sessions` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `tokenHash` VARCHAR(255) NOT NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` VARCHAR(512) NULL,
    `lastActiveAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `active_sessions_tokenHash_key`(`tokenHash`),
    INDEX `active_sessions_userId_idx`(`userId`),
    INDEX `active_sessions_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `assets` (
    `id` CHAR(36) NOT NULL,
    `category` ENUM('AVATAR', 'KTP', 'FOTO_KOST', 'FOTO_KAMAR', 'BUKTI_BAYAR', 'BANNER', 'LAINNYA') NOT NULL,
    `originalName` VARCHAR(255) NOT NULL,
    `storagePath` VARCHAR(512) NOT NULL,
    `mimeType` VARCHAR(100) NOT NULL,
    `sizeBytes` INTEGER NOT NULL,
    `url` VARCHAR(512) NOT NULL,
    `uploadedBy` CHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `assets_category_idx`(`category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_campuses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `singkatan` VARCHAR(20) NOT NULL,
    `kota` VARCHAR(100) NOT NULL,
    `alamat` TEXT NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_banks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `kode` VARCHAR(10) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `master_banks_kode_key`(`kode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_facilities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `icon` VARCHAR(50) NULL,
    `kategori` VARCHAR(50) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boarding_houses` (
    `id` CHAR(36) NOT NULL,
    `ownerId` CHAR(36) NOT NULL,
    `kampusId` INTEGER NULL,
    `nama` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(220) NOT NULL,
    `deskripsi` TEXT NULL,
    `alamat` TEXT NOT NULL,
    `kota` VARCHAR(100) NOT NULL,
    `kodePos` VARCHAR(10) NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `jenisKelamin` VARCHAR(20) NOT NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `boarding_houses_slug_key`(`slug`),
    INDEX `boarding_houses_ownerId_idx`(`ownerId`),
    INDEX `boarding_houses_kampusId_idx`(`kampusId`),
    INDEX `boarding_houses_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boarding_house_facilities` (
    `boardingHouseId` CHAR(36) NOT NULL,
    `facilityId` INTEGER NOT NULL,

    PRIMARY KEY (`boardingHouseId`, `facilityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boarding_house_images` (
    `id` CHAR(36) NOT NULL,
    `boardingHouseId` CHAR(36) NOT NULL,
    `assetId` CHAR(36) NOT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `isCover` BOOLEAN NOT NULL DEFAULT false,
    `caption` VARCHAR(255) NULL,

    INDEX `boarding_house_images_boardingHouseId_idx`(`boardingHouseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` CHAR(36) NOT NULL,
    `boardingHouseId` CHAR(36) NOT NULL,
    `nomorKamar` VARCHAR(20) NOT NULL,
    `lantai` INTEGER NULL,
    `luasM2` DECIMAL(5, 2) NULL,
    `hargaBulan` INTEGER NOT NULL,
    `hargaTahun` INTEGER NULL,
    `kapasitas` INTEGER NOT NULL DEFAULT 1,
    `status` ENUM('TERSEDIA', 'TERISI', 'MAINTENANCE') NOT NULL DEFAULT 'TERSEDIA',
    `deskripsi` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `rooms_boardingHouseId_idx`(`boardingHouseId`),
    UNIQUE INDEX `rooms_boardingHouseId_nomorKamar_key`(`boardingHouseId`, `nomorKamar`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room_facilities` (
    `roomId` CHAR(36) NOT NULL,
    `facilityId` INTEGER NOT NULL,

    PRIMARY KEY (`roomId`, `facilityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `room_images` (
    `id` CHAR(36) NOT NULL,
    `roomId` CHAR(36) NOT NULL,
    `assetId` CHAR(36) NOT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `isCover` BOOLEAN NOT NULL DEFAULT false,

    INDEX `room_images_roomId_idx`(`roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rentals` (
    `id` CHAR(36) NOT NULL,
    `roomId` CHAR(36) NOT NULL,
    `penyewaId` CHAR(36) NOT NULL,
    `tanggalMulai` DATE NOT NULL,
    `tanggalAkhir` DATE NOT NULL,
    `hargaDisetujui` INTEGER NOT NULL,
    `status` ENUM('MENUNGGU_BAYAR', 'MENUNGGU_VERIF', 'AKTIF', 'JATUH_TEMPO', 'SELESAI', 'DIBATALKAN') NOT NULL DEFAULT 'MENUNGGU_BAYAR',
    `catatan` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `rentals_roomId_idx`(`roomId`),
    INDEX `rentals_penyewaId_idx`(`penyewaId`),
    INDEX `rentals_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` CHAR(36) NOT NULL,
    `rentalId` CHAR(36) NOT NULL,
    `tipe` ENUM('BOOKING', 'PERPANJANGAN', 'DENDA', 'REFUND') NOT NULL,
    `nominal` INTEGER NOT NULL,
    `periodeAwal` DATE NULL,
    `periodeAkhir` DATE NULL,
    `batasTransfer` DATETIME(3) NULL,
    `buktiAssetId` CHAR(36) NULL,
    `nomorReferensi` VARCHAR(100) NULL,
    `namaBank` VARCHAR(100) NULL,
    `status` ENUM('MENUNGGU_BUKTI', 'MENUNGGU_VERIF', 'LUNAS', 'DITOLAK', 'DIBATALKAN') NOT NULL DEFAULT 'MENUNGGU_BUKTI',
    `verifiedById` CHAR(36) NULL,
    `verifiedAt` DATETIME(3) NULL,
    `rejectionNote` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `transactions_rentalId_idx`(`rentalId`),
    INDEX `transactions_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishlists` (
    `userId` CHAR(36) NOT NULL,
    `boardingHouseId` CHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`, `boardingHouseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_rooms` (
    `id` CHAR(36) NOT NULL,
    `boardingHouseId` CHAR(36) NOT NULL,
    `buyerId` CHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastMessageAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `chat_rooms_buyerId_idx`(`buyerId`),
    UNIQUE INDEX `chat_rooms_boardingHouseId_buyerId_key`(`boardingHouseId`, `buyerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` CHAR(36) NOT NULL,
    `chatRoomId` CHAR(36) NOT NULL,
    `senderId` CHAR(36) NOT NULL,
    `konten` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `chat_messages_chatRoomId_idx`(`chatRoomId`),
    INDEX `chat_messages_senderId_idx`(`senderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `broadcasts` (
    `id` CHAR(36) NOT NULL,
    `senderId` CHAR(36) NOT NULL,
    `judul` VARCHAR(255) NOT NULL,
    `konten` TEXT NOT NULL,
    `targetRole` ENUM('PENYEWA', 'MITRA', 'ADMIN') NULL,
    `boardingHouseId` CHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `broadcasts_senderId_idx`(`senderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `complaints` (
    `id` CHAR(36) NOT NULL,
    `pelaporId` CHAR(36) NOT NULL,
    `boardingHouseId` CHAR(36) NULL,
    `judul` VARCHAR(255) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `kategori` VARCHAR(100) NOT NULL,
    `prioritas` ENUM('RENDAH', 'SEDANG', 'TINGGI', 'KRITIS') NOT NULL DEFAULT 'SEDANG',
    `status` ENUM('TERBUKA', 'DIPROSES', 'SELESAI', 'DITUTUP') NOT NULL DEFAULT 'TERBUKA',
    `resolusi` TEXT NULL,
    `resolvedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `complaints_pelaporId_idx`(`pelaporId`),
    INDEX `complaints_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faqs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pertanyaan` VARCHAR(500) NOT NULL,
    `jawaban` TEXT NOT NULL,
    `kategori` VARCHAR(100) NOT NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cms_banners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(500) NULL,
    `imageAssetId` CHAR(36) NOT NULL,
    `linkUrl` VARCHAR(512) NULL,
    `placement` ENUM('HERO', 'SIDEBAR', 'TENGAH') NOT NULL DEFAULT 'HERO',
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `mulaiAt` DATETIME(3) NULL,
    `berakhirAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp_tokens` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NOT NULL,
    `tujuan` VARCHAR(50) NOT NULL,
    `kodeHash` VARCHAR(255) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `isUsed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `otp_tokens_userId_idx`(`userId`),
    INDEX `otp_tokens_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` CHAR(36) NOT NULL,
    `userId` CHAR(36) NULL,
    `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT', 'SUSPEND') NOT NULL,
    `targetModel` VARCHAR(100) NOT NULL,
    `targetId` VARCHAR(36) NULL,
    `perubahanLama` JSON NULL,
    `perubahanBaru` JSON NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` VARCHAR(512) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_userId_idx`(`userId`),
    INDEX `audit_logs_targetModel_targetId_idx`(`targetModel`, `targetId`),
    INDEX `audit_logs_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_avatarAssetId_fkey` FOREIGN KEY (`avatarAssetId`) REFERENCES `assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_kampusId_fkey` FOREIGN KEY (`kampusId`) REFERENCES `master_campuses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `owner_profiles` ADD CONSTRAINT `owner_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `owner_profiles` ADD CONSTRAINT `owner_profiles_ktpAssetId_fkey` FOREIGN KEY (`ktpAssetId`) REFERENCES `assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `active_sessions` ADD CONSTRAINT `active_sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boarding_houses` ADD CONSTRAINT `boarding_houses_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boarding_houses` ADD CONSTRAINT `boarding_houses_kampusId_fkey` FOREIGN KEY (`kampusId`) REFERENCES `master_campuses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boarding_house_facilities` ADD CONSTRAINT `boarding_house_facilities_boardingHouseId_fkey` FOREIGN KEY (`boardingHouseId`) REFERENCES `boarding_houses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boarding_house_facilities` ADD CONSTRAINT `boarding_house_facilities_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `master_facilities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boarding_house_images` ADD CONSTRAINT `boarding_house_images_boardingHouseId_fkey` FOREIGN KEY (`boardingHouseId`) REFERENCES `boarding_houses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boarding_house_images` ADD CONSTRAINT `boarding_house_images_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_boardingHouseId_fkey` FOREIGN KEY (`boardingHouseId`) REFERENCES `boarding_houses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room_facilities` ADD CONSTRAINT `room_facilities_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room_facilities` ADD CONSTRAINT `room_facilities_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `master_facilities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room_images` ADD CONSTRAINT `room_images_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `room_images` ADD CONSTRAINT `room_images_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rentals` ADD CONSTRAINT `rentals_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rentals` ADD CONSTRAINT `rentals_penyewaId_fkey` FOREIGN KEY (`penyewaId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_rentalId_fkey` FOREIGN KEY (`rentalId`) REFERENCES `rentals`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_buktiAssetId_fkey` FOREIGN KEY (`buktiAssetId`) REFERENCES `assets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlists` ADD CONSTRAINT `wishlists_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlists` ADD CONSTRAINT `wishlists_boardingHouseId_fkey` FOREIGN KEY (`boardingHouseId`) REFERENCES `boarding_houses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_rooms` ADD CONSTRAINT `chat_rooms_boardingHouseId_fkey` FOREIGN KEY (`boardingHouseId`) REFERENCES `boarding_houses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_rooms` ADD CONSTRAINT `chat_rooms_buyerId_fkey` FOREIGN KEY (`buyerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_chatRoomId_fkey` FOREIGN KEY (`chatRoomId`) REFERENCES `chat_rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `broadcasts` ADD CONSTRAINT `broadcasts_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `complaints` ADD CONSTRAINT `complaints_pelaporId_fkey` FOREIGN KEY (`pelaporId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `complaints` ADD CONSTRAINT `complaints_boardingHouseId_fkey` FOREIGN KEY (`boardingHouseId`) REFERENCES `boarding_houses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cms_banners` ADD CONSTRAINT `cms_banners_imageAssetId_fkey` FOREIGN KEY (`imageAssetId`) REFERENCES `assets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `otp_tokens` ADD CONSTRAINT `otp_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs` ADD CONSTRAINT `audit_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
