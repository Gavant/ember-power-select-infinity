import { render } from '@ember/test-helpers';

import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';

import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

interface Context extends TestContext {
    select: {
        actions: {
            scrollTo: () => void;
        };
    };
    extra: {
        estimateHeight: number;
    };
}

module('Integration | Component | power-select-infinity/options', function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (this: Context, assert) {
        this.select = {
            actions: {
                scrollTo: () => {}
            }
        };
        this.extra = {
            estimateHeight: 30
        };
        await render(hbs`
        <div class="ember-power-select-options">
            <PowerSelectInfinity::Options @extra={{this.extra}} @select={{this.select}}>
                template block text
            </PowerSelectInfinity::Options>
        </div>
    `);

        assert.equal(this.element.textContent?.trim(), '');
    });
});
