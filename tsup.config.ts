import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/app.ts'],
    format: ['esm'],
    target: 'node24',
    outDir: 'dist',
    clean: true,
    sourcemap: true,
    splitting: false,
    bundle: true,
});
