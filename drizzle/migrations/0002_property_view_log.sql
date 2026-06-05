CREATE TABLE `property_views` (
	`id` varchar(36) NOT NULL,
	`property_id` varchar(36) NOT NULL,
	`ip_address` varchar(50) NOT NULL,
	`viewed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `property_views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `property_views` ADD CONSTRAINT `property_views_property_id_kost_properties_id_fk` FOREIGN KEY (`property_id`) REFERENCES `kost_properties`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `property_views_property_idx` ON `property_views` (`property_id`);--> statement-breakpoint
CREATE INDEX `property_views_ip_idx` ON `property_views` (`ip_address`);
