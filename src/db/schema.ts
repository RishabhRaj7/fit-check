import { sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  categories: text("categories")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  priority: integer("priority").notNull().default(0),
  needsData: boolean("needs_data").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sizeCharts = pgTable(
  "size_charts",
  {
    id: serial("id").primaryKey(),
    brandId: integer("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "cascade" }),
    category: text("category").notNull(), // sneakers | slides | tshirt | trousers
    gender: text("gender").notNull(), // men | women | unisex
    needsData: boolean("needs_data").notNull().default(false),
    updatedBy: text("updated_by"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("chart_brand_cat_gender").on(t.brandId, t.category, t.gender)]
);

export const sizeChartRows = pgTable("size_chart_rows", {
  id: serial("id").primaryKey(),
  chartId: integer("chart_id")
    .notNull()
    .references(() => sizeCharts.id, { onDelete: "cascade" }),
  anchorValue: doublePrecision("anchor_value").notNull(),
  eu: text("eu"),
  uk: text("uk"),
  us: text("us"),
  jpn: text("jpn"),
  ind: text("ind"),
  label: text("label"),
  sort: integer("sort").notNull().default(0),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id")
    .notNull()
    .references(() => brands.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  imageUrl: text("image_url"),
  priceInr: integer("price_inr"),
});

export type Brand = typeof brands.$inferSelect;
export type SizeChart = typeof sizeCharts.$inferSelect;
export type SizeChartRow = typeof sizeChartRows.$inferSelect;
export type Product = typeof products.$inferSelect;
