import {assert} from 'chai';
import any from '@travi/any';
import {requireTokenValue} from '../../src/prompt-validations';

suite('prompt validations', () => {
  suite('token value is required', () => {
    test('that a provided value passes the validation', () => assert.isTrue(requireTokenValue(any.word())));

    test('that an empty value fails the validation', () => {
      assert.equal(requireTokenValue(), 'A token value must be provided');
    });
  });
});
