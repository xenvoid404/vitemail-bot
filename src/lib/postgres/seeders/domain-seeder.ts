import { db } from '@/lib/postgres';
import { domains } from '@/lib/postgres/schema';
import type { NewDomain } from '@/lib/postgres/types';

export const domainSeeder = async () => {
    console.log('  Seeding domains...');

    const data: NewDomain[] = [
        { id: 1, name: 'esempe.web.id' },
        { id: 2, name: 'nekopay.my.id' },
        { id: 3, name: 'nekopay.web.id' },
        { id: 4, name: 'popshort.my.id' },
        { id: 5, name: 'wuniverse.web.id' },
        { id: 6, name: 'xenhub.my.id' },
        { id: 7, name: 'xenkit.my.id' },
        { id: 8, name: 'xenverse.biz.id' },
        { id: 9, name: 'xenverse.web.id' },
        { id: 10, name: 'yuipedia.com' },
    ];

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
