import { build } from 'esbuild';

build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm', // Emit ES modules
    outfile: './dist/index.js',
    external: [
        'axios',
        'ora',
        'inquirer',
        'commander',
        'clipboardy',
        'fs/promises',
        'path',
        'os',
    ],
}).catch(() => process.exit(1));
