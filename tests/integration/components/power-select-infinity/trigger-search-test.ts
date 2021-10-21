import { render } from '@ember/test-helpers';

import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';

import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

interface Context extends TestContext {
    onFocus: () => void;
    onInput: () => void;
}
module('Integration | Component | power-select-infinity/trigger-search', function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (this: Context, assert) {
        this.onFocus = () => {};
        this.onInput = () => {};
        await render(hbs`<PowerSelectInfinity::TriggerSearch @onFocus={{this.onFocus}} @onInput={{this.onInput}} />`);

        assert.equal(this.element.textContent?.trim(), '');
    });
});
