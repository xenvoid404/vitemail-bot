import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const applications = sqliteTable('applications', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    emailExpired: integer('email_expired').default(60).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date())
        .notNull(),
});

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    chatId: text('chat_id').unique().notNull(),
    username: text('username').unique().notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name'),
    role: text('role', { enum: ['admin', 'user'] })
        .default('user')
        .notNull(),
    status: text('status', { enum: ['active', 'inactive'] })
        .default('active')
        .notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date())
        .notNull(),
});

export const domains = sqliteTable('domains', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').unique().notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date())
        .notNull(),
});

export const emails = sqliteTable('emails', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
        .references(() => users.id, { onUpdate: 'cascade', onDelete: 'cascade' })
        .notNull(),
    domainId: integer('domain_id')
        .references(() => domains.id, { onUpdate: 'cascade', onDelete: 'cascade' })
        .notNull(),
    address: text('address').unique().notNull(),
    expiredAt: integer('expired_at', { mode: 'timestamp' }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date())
        .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date())
        .$onUpdate(() => new Date())
        .notNull(),
});
