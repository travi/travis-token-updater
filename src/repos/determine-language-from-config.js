import {safeLoad as parseYaml} from 'js-yaml';

export default function (yaml) {
  return parseYaml(Buffer.from(yaml, 'base64').toString()).language;
}
