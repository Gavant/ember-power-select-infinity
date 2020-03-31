import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | power-select-infinity/power-select-infinity', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{power-select-infinity/power-select-infinity}}`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#power-select-infinity/power-select-infinity}}
        template block text
      {{/power-select-infinity/power-select-infinity}}
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
