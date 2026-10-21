import { pgTable, integer, varchar, timestamp, smallint } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    telegramId: integer().primaryKey().notNull(),
    phone: varchar().notNull(),
    token: varchar({ length: 64 }),
});

export const person_survey = pgTable("person_survey", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    q1: smallint().notNull(),
    q2: smallint().notNull(),
    q3: smallint().notNull(),
    q4: smallint().notNull(),
    q5: smallint().notNull(),
    q6: smallint().notNull(),
    q7: smallint().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const person_info = pgTable("person_info", {
    id: integer().primaryKey().notNull(),
    name: varchar(),
    contact: varchar(),
    address: varchar(),
    birthday: varchar(),
    // validTime: varchar(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const person_memo = pgTable("person_memo", {
    id: integer().primaryKey().notNull(),
    u_department: varchar(),
    u_location: varchar(),
    mbti: varchar(),
    etc: varchar(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
