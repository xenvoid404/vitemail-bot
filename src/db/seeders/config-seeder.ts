import { db } from '@/db';
import { configs } from '@/db/schema';

export const configSeeder = async () => {
    console.log('  Seeding configs...');
    await db
        .insert(configs)
        .values({ id: 1, emailExpired: 60 })
        .onConflictDoUpdate({
            target: configs.id,
            set: { emailExpired: 60 },
        });

    console.log(`  configs seeded`);
};
