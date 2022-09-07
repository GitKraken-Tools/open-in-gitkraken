import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  format: ['cjs', 'esm'],
  noExternal: ['pushstate-js'],
  sourcemap: true,
  clean: true,
  onSuccess: 'tsc src/index.ts --emitDeclarationOnly --declaration --outDir dist --lib dom,es2022',
});