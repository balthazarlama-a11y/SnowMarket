import { pgTable, serial, text, real, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const apartmentsTable = pgTable("apartments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  resort: text("resort").notNull(),
  pricePerNight: real("price_per_night").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  maxGuests: integer("max_guests").notNull(),
  verified: boolean("verified").notNull().default(false),
  rating: real("rating").notNull().default(0),
  reviewCount: integer("review_count").notNull().default(0),
  imageUrl: text("image_url").notNull(),
  amenities: text("amenities").array().notNull().default([]),
});

export const insertApartmentSchema = createInsertSchema(apartmentsTable).omit({ id: true });
export type InsertApartment = z.infer<typeof insertApartmentSchema>;
export type Apartment = typeof apartmentsTable.$inferSelect;
