import { type SQL, eq, getTableColumns, isNull } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';

export function buildWhereCondition<TTable extends PgTable, K extends keyof TTable['_']['columns']>(table: TTable, col: K, val: unknown): SQL {
    const columns = getTableColumns(table);
    const targetColumn = columns[col as string];
    return val === null ? isNull(targetColumn) : eq(targetColumn as any, val as any);
}
