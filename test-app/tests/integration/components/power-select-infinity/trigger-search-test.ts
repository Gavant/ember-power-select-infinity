import { render, TestContext } from '@ember/test-helpers';

import { setupRenderingTest } from 'ember-qunit';

import { Select } from '@gavant/glint-template-types/types/ember-power-select/components/power-select';

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
        assert.dom('.trigger-search-container').exists();
    });
});
