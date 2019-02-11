import filter from '../../../src/repos/filter-to-js-projects';

suite('js-projects filter', () => {
  test('that only js-projects are included in the output', () => {
    filter();
  });
});
