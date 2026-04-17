import { db } from '@/lib/sqlite';
import { applications } from '@/lib/sqlite/schema';

export const applicationSeeder = async () => {
    console.log('  Seeding applications...');
    await db
        .insert(applications)
        .values({ id: 1, emailExpired: 60 })
        .onConflictDoUpdate({
            target: applications.id,
            set: { emailExpired: 60 },
        });

    console.log(`  applications seeded`);
};
