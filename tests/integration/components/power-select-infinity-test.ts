import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import 'qunit-dom';

module('Integration | Component | power-select-infinity', function(hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        this.set('onChange', function(event: Event) { event.preventDefault(); });

        // Template block usage:
        await render(hbs`
        <PowerSelectInfinity @onChange={{this.onChange}}>
            template block text
        </PowerSelectInfinity>
        `);

        assert.dom(this.element).hasText('template block text');
    });
});
