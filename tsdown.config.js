import {defineConfig} from 'tsdown';

export default defineConfig({
  clean: true,
  dts: true,
  entry: [
    'src/*.ts',
  ],
  format: 'esm',
  minify: {
    mangle: false,
  },
  outDir: 'lib',
  sourcemap: false,
  splitting: false,
  target: 'es2022',
  unbundle: true,
});
