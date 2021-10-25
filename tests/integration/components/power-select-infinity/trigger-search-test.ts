import { render } from '@ember/test-helpers';

import { Select } from 'ember-power-select/addon/components/power-select';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';

import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

interface Context extends TestContext {
    onFocus: () => void;
    onInput: () => void;
    select: Select;
}
module('Integration | Component | power-select-infinity/trigger-search', function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (this: Context, assert) {
        this.onFocus = () => {};
        this.onInput = () => {};
        this.select = {
            selected: null,
            options: [],
            highlighted: null,
            results: [],
            resultsCount: 0,
            loading: false,
            isActive: false,
            searchText: '',
            lastSearchedText: '',
            disabled: false,
            actions: {
                search: () => {},
                highlight: () => {},
                select: () => {},
                scrollTo: () => {},
                choose: () => {},
                toggle: () => {},
                close: () => {},
                open: () => {},
                reposition: () => {
                    return { hPosition: '0', vPosition: '', otherStyles: {} };
                }
            },
            uniqueId: '123',
            isOpen: false
        };
        await render(
            hbs`<PowerSelectInfinity::TriggerSearch @onFocus={{this.onFocus}} @onInput={{this.onInput}} @select={{this.select}} />`
        );

        assert.equal(this.element.textContent?.trim(), '');
    });
});
