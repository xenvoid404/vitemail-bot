import { applicationSeeder } from '@/lib/sqlite/seeders/application-seeder';
import { domainSeeder } from '@/lib/sqlite/seeders/domain-seeder';

const run = async () => {
    await applicationSeeder();
    await domainSeeder();

    process.exit(0);
};

run();
