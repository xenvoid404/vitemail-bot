import * as schema from '@/lib/postgres/schema';

export type NewConfig = typeof schema.configs.$inferInsert;
export type Config = typeof schema.configs.$inferSelect;

export type NewUser = typeof schema.users.$inferInsert;
export type User = typeof schema.users.$inferSelect;

export type NewDomain = typeof schema.domains.$inferInsert;
export type Domain = typeof schema.domains.$inferSelect;

export type NewEmail = typeof schema.emails.$inferInsert;
export type Email = typeof schema.emails.$inferSelect;

export type NewInbox = typeof schema.inboxes.$inferInsert;
export type Inbox = typeof schema.inboxes.$inferSelect;
