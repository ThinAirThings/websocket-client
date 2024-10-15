import { defineConfig } from 'tsup';

export default defineConfig([
    // Packaging
    {
        entry: { index: 'src/index.ts' },
        sourcemap: true,
        clean: true,
        shims: true,
        dts: true,
        format: ["esm", 'cjs'],
        tsconfig: "tsconfig.json",
    }
])