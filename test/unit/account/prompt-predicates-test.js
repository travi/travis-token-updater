import {assert} from 'chai';
import any from '@travi/any';
import {organizationChooserShouldBePresented} from '../../../src/account/prompt-predicates';

suite('account prompt predicates', () => {
  suite('choose organization', () => {
    test('that false is returned if the user account was chosen', () => {
      assert.isFalse(organizationChooserShouldBePresented({userOrOrg: any.word()}));
    });

    test('that true is returned if the user account was chosen', () => {
      assert.isTrue(organizationChooserShouldBePresented({userOrOrg: 'organization'}));
    });
  });
});
