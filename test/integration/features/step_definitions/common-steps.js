import {After, Before} from 'cucumber';
import nock from 'nock';

Before(function () {
  nock.disableNetConnect();
});

After(function () {
  nock.enableNetConnect();
  nock.cleanAll();
});
