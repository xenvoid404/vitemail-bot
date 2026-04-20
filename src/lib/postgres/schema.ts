import { sql } from 'drizzle-orm';
import { bigint, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role_enum', ['admin', 'user']);
export const userStatusEnum = pgEnum('user_status_enum', ['active', 'inactive']);

export const configs = pgTable('configs', {
    id: serial('id').primaryKey(),
    emailExpired: integer('email_expired').default(60).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => sql`now()`),
});

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    chatId: bigint('chat_id', { mode: 'number' }).unique().notNull(),
    username: varchar('username', { length: 255 }).unique().notNull(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }),
    role: userRoleEnum('role').default('user').notNull(),
    status: userStatusEnum('status').default('active').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => sql`now()`),
});

export const domains = pgTable('domains', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).unique().notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => sql`now()`),
});

export const emails = pgTable('emails', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => users.id, { onUpdate: 'cascade', onDelete: 'cascade' })
        .notNull(),
    domainId: integer('domain_id')
        .references(() => domains.id, { onUpdate: 'cascade', onDelete: 'cascade' })
        .notNull(),
    address: varchar('address', { length: 255 }).unique().notNull(),
    expiredAt: timestamp('expired_at').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => sql`now()`),
});

export const inboxes = pgTable('inboxes', {
    id: serial('id').primaryKey(),
    emailId: integer('email_id')
        .references(() => emails.id, { onUpdate: 'cascade', onDelete: 'cascade' })
        .notNull(),
    to: varchar('to', { length: 255 }).notNull(),
    from: varchar('from', { length: 255 }).notNull(),
    fromName: varchar('from_name', { length: 255 }),
    subject: varchar('subject', { length: 512 }).notNull(),
    body: text('body').notNull(),
    bodyHtml: text('body_html'),
    rawSize: integer('raw_size').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => sql`now()`),
});
