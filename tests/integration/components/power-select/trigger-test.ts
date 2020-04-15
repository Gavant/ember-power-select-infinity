import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import 'qunit-dom';

module('Integration | Component | power-select/trigger', function(hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        // Template block usage:
        await render(hbs`
        {{#power-select-infinity/trigger}}
            template block text
        {{/power-select-infinity/trigger}}
        `);

        assert.dom(this.element).hasText('template block text');
    });
});
