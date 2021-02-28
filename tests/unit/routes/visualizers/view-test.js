import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | visualizers/view', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:visualizers/view');
    assert.ok(route);
  });
});
