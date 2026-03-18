import { pgTable, serial, text, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const equipmentTable = pgTable("equipment", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  condition: text("condition").notNull(),
  price: real("price").notNull(),
  seller: text("seller").notNull(),
  verified: boolean("verified").notNull().default(false),
  purchaseType: text("purchase_type").notNull().default("normal"),
  imageUrl: text("image_url").notNull(),
  size: text("size"),
  brand: text("brand").notNull(),
});

export const insertEquipmentSchema = createInsertSchema(equipmentTable).omit({ id: true });
export type InsertEquipment = z.infer<typeof insertEquipmentSchema>;
export type Equipment = typeof equipmentTable.$inferSelect;
