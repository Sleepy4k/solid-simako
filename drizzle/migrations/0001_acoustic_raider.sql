CREATE TABLE `room_images` (
	`id` varchar(36) NOT NULL,
	`room_id` varchar(36) NOT NULL,
	`url` varchar(500) NOT NULL,
	`alt_text` varchar(200),
	`sort_order` tinyint NOT NULL DEFAULT 0,
	`is_primary` boolean NOT NULL DEFAULT false,
	CONSTRAINT `room_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `room_views` (
	`id` varchar(36) NOT NULL,
	`room_id` varchar(36) NOT NULL,
	`ip_address` varchar(50) NOT NULL,
	`viewed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `room_views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `rooms` ADD `slug` varchar(250);--> statement-breakpoint
ALTER TABLE `rooms` ADD `description` text;--> statement-breakpoint
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_slug_unique` UNIQUE(`slug`);--> statement-breakpoint
ALTER TABLE `room_images` ADD CONSTRAINT `room_images_room_id_rooms_id_fk` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `room_views` ADD CONSTRAINT `room_views_room_id_rooms_id_fk` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `room_images_room_idx` ON `room_images` (`room_id`);--> statement-breakpoint
CREATE INDEX `room_views_room_idx` ON `room_views` (`room_id`);--> statement-breakpoint
CREATE INDEX `room_views_ip_idx` ON `room_views` (`ip_address`);