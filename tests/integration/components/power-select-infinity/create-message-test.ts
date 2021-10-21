import { render } from '@ember/test-helpers';

import { setupRenderingTest } from 'ember-qunit';

import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | power-select-infinity/create-message', function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
        await render(hbs`{{power-select-infinity/create-message}}`);

        assert.equal(this.element.textContent?.trim(), '');
    });
});
