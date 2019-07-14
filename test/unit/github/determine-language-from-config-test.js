import jsYaml from 'js-yaml';
import {assert} from 'chai';
import sinon from 'sinon';
import any from '@travi/any';
import determineLanguage from '../../../src/github/determine-language-from-config';

suite('determine language from Travis-CI config', () => {
  let sandbox;

  setup(() => {
    sandbox = sinon.createSandbox();

    sandbox.stub(jsYaml, 'safeLoad');
    sandbox.stub(Buffer, 'from');
  });

  teardown(() => sandbox.restore());

  test('that the language is read from the config', () => {
    const yaml = any.simpleObject();
    const language = any.word();
    const parsedYaml = {...any.simpleObject(), language};
    const decodedContent = any.simpleObject();
    const toString = () => decodedContent;
    Buffer.from.withArgs(yaml, 'base64').returns({toString});
    jsYaml.safeLoad.withArgs(decodedContent).returns(parsedYaml);

    assert.equal(determineLanguage(yaml), language);
  });
});
