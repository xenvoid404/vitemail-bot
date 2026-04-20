import { configSeeder } from '@/lib/postgres/seeders/config-seeder';
import { domainSeeder } from '@/lib/postgres/seeders/domain-seeder';

const run = async () => {
    await configSeeder();
    await domainSeeder();

    process.exit(0);
};

run();
