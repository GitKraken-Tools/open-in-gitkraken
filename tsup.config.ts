import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/contextmenu.ts'],
  splitting: false,
  format: ['cjs', 'esm'],
  noExternal: ['pushstate-js'],
  sourcemap: true,
  clean: true,
  onSuccess: 'tsc src/index.ts src/contextmenu.ts --emitDeclarationOnly --declaration --outDir dist --lib dom,es2022; mv -v dist/contextmenu.js .',
});