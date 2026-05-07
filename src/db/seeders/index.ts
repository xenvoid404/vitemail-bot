import { configSeeder } from '@/db/seeders/config-seeder';
import { domainSeeder } from '@/db/seeders/domain-seeder';

const run = async () => {
    await configSeeder();
    await domainSeeder();

    process.exit(0);
};

run();
