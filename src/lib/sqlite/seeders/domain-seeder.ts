import { db } from '@/lib/sqlite';
import { domains } from '@/lib/sqlite/schema';
import type { NewDomain } from '@/lib/sqlite/types';

export const domainSeeder = async () => {
    console.log('  Seeding domains...');

    const data: NewDomain[] = [{ id: 1, name: 'esempe.web.id' }];

    for (const row of data) {
        await db
            .insert(domains)
            .values(row)
            .onConflictDoUpdate({
                target: domains.id,
                set: { name: row.name },
            });
    }

    console.log(`  ${data.length} domains seeded`);
};
