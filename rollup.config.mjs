/* eslint import/no-extraneous-dependencies: ['error', {'devDependencies': true}] */
import nodeResolve from '@rollup/plugin-node-resolve';
import autoExternal from 'rollup-plugin-auto-external';

export default {
  input: 'src/index.js',
  plugins: [
    autoExternal(),
    nodeResolve({
      module: true,
      jsnext: true
    })
  ],
  output: [
    {file: 'lib/index.cjs.js', format: 'cjs', sourcemap: true},
    {file: 'lib/index.es.js', format: 'es', sourcemap: true}
  ]
};
