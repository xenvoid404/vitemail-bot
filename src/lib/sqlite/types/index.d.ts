import * as schema from '@/lib/sqlite/schema';

export type NewApplication = typeof schema.applications.$inferInsert;
export type Application = typeof schema.applications.$inferSelect;

export type NewUser = typeof schema.users.$inferInsert;
export type User = typeof schema.users.$inferSelect;

export type NewDomain = typeof schema.domains.$inferInsert;
export type Domain = typeof schema.domains.$inferSelect;

export type NewEmail = typeof schema.emails.$inferInsert;
export type Email = typeof schema.emails.$inferSelect;
