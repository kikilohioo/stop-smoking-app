import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

export const motives = sqliteTable("motives", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  social: integer("social"),
  emotional: integer("emotional"),
  conductual: integer("sconductualocial"),
  physiological: integer("physiological"),
});

export const cigars = sqliteTable("cigars", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  intensity: integer("intensity").notNull(),
  motiveId: integer("motive_id")
    .notNull()
    .references(() => motives.id),
  social: integer("social"),
  emotional: integer("emotional"),
  conductual: integer("conductual"),
  physiological: integer("physiological"),
  triggerId: integer("trigger_id")
    .notNull()
    .references(() => triggers.id),
  placeId: integer("place_id")
    .notNull()
    .references(() => places.id),
  partnerId: integer("partner_id")
    .notNull()
    .references(() => partners.id),
  dateTime: timestamp("date_time", { mode: "string" })
    .notNull()
    .default(sql`now()`),
});

export const triggers = sqliteTable("triggers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const places = sqliteTable("places", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});

export const partners = sqliteTable("partners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
});
