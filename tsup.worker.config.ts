import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/app/cloudflare/worker.ts'],
    format: ['esm'],
    target: 'node24',
    outDir: 'dist/worker',
    clean: false,
    sourcemap: false,
    splitting: false,
    dts: false,
    minify: true,
    noExternal: [/.*/],
});
