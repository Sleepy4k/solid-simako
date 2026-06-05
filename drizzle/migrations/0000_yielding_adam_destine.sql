CREATE TABLE `bookings` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`room_id` varchar(36) NOT NULL,
	`start_date` date NOT NULL,
	`end_date` date,
	`duration_months` tinyint NOT NULL DEFAULT 1,
	`total_amount` decimal(12,0) NOT NULL,
	`deposit_amount` decimal(12,0) NOT NULL DEFAULT '0',
	`status` enum('pending','active','ended','cancelled') NOT NULL DEFAULT 'pending',
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `facilities` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`icon` varchar(50) NOT NULL,
	`category` enum('basic','bathroom','connectivity','security','parking','kitchen','service') NOT NULL,
	CONSTRAINT `facilities_id` PRIMARY KEY(`id`),
	CONSTRAINT `facilities_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `facilities_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `kost_properties` (
	`id` varchar(36) NOT NULL,
	`tenant_id` varchar(36) NOT NULL,
	`name` varchar(150) NOT NULL,
	`slug` varchar(200) NOT NULL,
	`description` text,
	`address` varchar(300) NOT NULL,
	`city` varchar(100) NOT NULL DEFAULT 'Purwokerto',
	`district` varchar(100) NOT NULL,
	`postal_code` varchar(10),
	`latitude` decimal(10,7),
	`longitude` decimal(10,7),
	`rules` text,
	`kost_type` enum('kost','guest_house','apartment','kontrakan') NOT NULL DEFAULT 'kost',
	`gender_type` enum('male','female','mixed','campus') NOT NULL DEFAULT 'mixed',
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `kost_properties_id` PRIMARY KEY(`id`),
	CONSTRAINT `kost_properties_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `kost_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`type` enum('payment','booking','review','system') NOT NULL,
	`title` varchar(200) NOT NULL,
	`body` text NOT NULL,
	`is_read` boolean NOT NULL DEFAULT false,
	`related_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_proofs` (
	`id` varchar(36) NOT NULL,
	`booking_id` varchar(36) NOT NULL,
	`image_url` varchar(500) NOT NULL,
	`sender_bank` varchar(100) NOT NULL,
	`account_holder` varchar(100) NOT NULL,
	`transfer_date` date NOT NULL,
	`amount` decimal(12,0) NOT NULL,
	`notes` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`reviewed_by` varchar(36),
	`reviewed_at` timestamp,
	`rejection_reason` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payment_proofs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `property_facilities` (
	`property_id` varchar(36) NOT NULL,
	`facility_id` varchar(36) NOT NULL,
	CONSTRAINT `property_facilities_property_id_facility_id_pk` PRIMARY KEY(`property_id`,`facility_id`)
);
--> statement-breakpoint
CREATE TABLE `property_images` (
	`id` varchar(36) NOT NULL,
	`property_id` varchar(36) NOT NULL,
	`url` varchar(500) NOT NULL,
	`alt_text` varchar(200),
	`sort_order` tinyint NOT NULL DEFAULT 0,
	`is_primary` boolean NOT NULL DEFAULT false,
	CONSTRAINT `property_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` varchar(36) NOT NULL,
	`booking_id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`room_id` varchar(36) NOT NULL,
	`rating` tinyint NOT NULL,
	`comment` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `reviews_booking_id_unique` UNIQUE(`booking_id`)
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` varchar(36) NOT NULL,
	`property_id` varchar(36) NOT NULL,
	`room_number` varchar(20) NOT NULL,
	`type` varchar(100) NOT NULL DEFAULT 'Standard',
	`price_per_month` decimal(12,0) NOT NULL,
	`deposit_amount` decimal(12,0) NOT NULL DEFAULT '0',
	`size` varchar(30),
	`floor_number` tinyint,
	`status` enum('available','occupied','maintenance') NOT NULL DEFAULT 'available',
	`view_count` decimal NOT NULL DEFAULT '0',
	`avg_rating` decimal(3,2) NOT NULL DEFAULT '0.00',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rooms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tenants` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`business_name` varchar(150),
	`ktp_number` varchar(20),
	`bank_name` varchar(50),
	`bank_account` varchar(50),
	`bank_holder` varchar(100),
	`is_approved` boolean NOT NULL DEFAULT false,
	`approved_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tenants_id` PRIMARY KEY(`id`),
	CONSTRAINT `tenants_user_idx` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `user_favorites` (
	`user_id` varchar(36) NOT NULL,
	`room_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_favorites_user_id_room_id_pk` PRIMARY KEY(`user_id`,`room_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('user','tenant','admin') NOT NULL DEFAULT 'user',
	`phone` varchar(20),
	`avatar_url` varchar(500),
	`is_verified` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_room_id_rooms_id_fk` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `kost_properties` ADD CONSTRAINT `kost_properties_tenant_id_tenants_id_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_proofs` ADD CONSTRAINT `payment_proofs_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payment_proofs` ADD CONSTRAINT `payment_proofs_reviewed_by_users_id_fk` FOREIGN KEY (`reviewed_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `property_facilities` ADD CONSTRAINT `property_facilities_property_id_kost_properties_id_fk` FOREIGN KEY (`property_id`) REFERENCES `kost_properties`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `property_facilities` ADD CONSTRAINT `property_facilities_facility_id_facilities_id_fk` FOREIGN KEY (`facility_id`) REFERENCES `facilities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `property_images` ADD CONSTRAINT `property_images_property_id_kost_properties_id_fk` FOREIGN KEY (`property_id`) REFERENCES `kost_properties`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_booking_id_bookings_id_fk` FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_room_id_rooms_id_fk` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_property_id_kost_properties_id_fk` FOREIGN KEY (`property_id`) REFERENCES `kost_properties`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tenants` ADD CONSTRAINT `tenants_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_favorites` ADD CONSTRAINT `user_favorites_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_favorites` ADD CONSTRAINT `user_favorites_room_id_rooms_id_fk` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `bookings_user_idx` ON `bookings` (`user_id`);--> statement-breakpoint
CREATE INDEX `bookings_room_idx` ON `bookings` (`room_id`);--> statement-breakpoint
CREATE INDEX `bookings_status_idx` ON `bookings` (`status`);--> statement-breakpoint
CREATE INDEX `kost_tenant_idx` ON `kost_properties` (`tenant_id`);--> statement-breakpoint
CREATE INDEX `kost_city_idx` ON `kost_properties` (`city`);--> statement-breakpoint
CREATE INDEX `kost_gender_idx` ON `kost_properties` (`gender_type`);--> statement-breakpoint
CREATE INDEX `kost_type_idx` ON `kost_properties` (`kost_type`);--> statement-breakpoint
CREATE INDEX `notif_user_idx` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `notif_read_idx` ON `notifications` (`is_read`);--> statement-breakpoint
CREATE INDEX `proofs_booking_idx` ON `payment_proofs` (`booking_id`);--> statement-breakpoint
CREATE INDEX `proofs_status_idx` ON `payment_proofs` (`status`);--> statement-breakpoint
CREATE INDEX `images_property_idx` ON `property_images` (`property_id`);--> statement-breakpoint
CREATE INDEX `reviews_room_idx` ON `reviews` (`room_id`);--> statement-breakpoint
CREATE INDEX `reviews_user_idx` ON `reviews` (`user_id`);--> statement-breakpoint
CREATE INDEX `rooms_property_idx` ON `rooms` (`property_id`);--> statement-breakpoint
CREATE INDEX `rooms_status_idx` ON `rooms` (`status`);--> statement-breakpoint
CREATE INDEX `fav_user_idx` ON `user_favorites` (`user_id`);--> statement-breakpoint
CREATE INDEX `users_role_idx` ON `users` (`role`);