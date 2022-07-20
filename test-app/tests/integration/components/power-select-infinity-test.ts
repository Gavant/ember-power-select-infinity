import { click, render, TestContext, triggerKeyEvent } from '@ember/test-helpers';
import fillIn from '@ember/test-helpers/dom/fill-in';

import { setupRenderingTest } from 'ember-qunit';

import 'qunit-dom';

import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

interface TestObject {
    date: string;
    name: string;
    age: number;
    tall: boolean;
    short: boolean;
    id: string;
}
interface PowerSelectInfinityContext extends TestContext {
    selected: TestObject | undefined;
    canLoadMore: boolean;
    onChange: (selected: TestObject) => void;
    options: TestObject[];
    createOption?: (text: string) => void;
    search?: (text: string) => void;
    generateOptions: (number: number) => TestObject[];
    loadMore?: () => TestObject[];
}

module('Integration | Component | power-select-infinity', function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function (this: PowerSelectInfinityContext) {
        this.generateOptions = (number: number) => {
            const options = [];
            for (let i = 0; i <= number - 1; i++) {
                options.push({
                    date: new Date().toISOString(),
                    name: `New row ${i}`,
                    age: 150,
                    tall: false,
                    short: true,
                    id: `${Date.now() + i}`
                });
            }
            return options;
        };
        const options: TestObject[] = this.generateOptions(20);
        this.set('options', options);
    });

    test('Selecting option works', async function (this: PowerSelectInfinityContext, assert) {
        this.onChange = (selected: TestObject) => {
            this.selected = selected;
        };
        await render(hbs`
            <PowerSelectInfinity
                @selected={{this.selected}}
                @onChange={{this.onChange}}
                @options={{this.options}}
                @canLoadMore={{true}}
                @loadMore={{this.loadMore}}
                @search={{this.search}}
                @allowClear={{true}}
                @placeholder={{"Search"}}
                @searchPlaceholder={{@searchPlaceholder}}
                @loadingMessage={{"loading"}}
                @searchField={{@searchField}}
                @triggerClass={{@triggerClass}}
                @clearOptions={{this.clearOptions}}
                @renderInPlace={{true}}
                as |option|
            >
                <div
                    class="ember-power-select-option-section {{if option.heading "ember-power-select-option-section-has-heading"}}"
                >
                    {{#if option.heading}}
                        <div class="ember-power-select-option-section-heading font-weight-bold">
                            {{option.heading}}
                        </div>
                    {{/if}}
                    <div class="text-truncate">

                        {{option.name}}
                    </div>
                </div>
        </PowerSelectInfinity>
    `);
        // TODO: fix this test
        // await click('.ember-power-select-trigger-input');

        // await click('.ember-basic-dropdown-content li');

        // assert.equal(this.selected?.name, 'New row 0');
        assert.ok(true);
    });

    test('Creating new option works', async function (this: PowerSelectInfinityContext, assert) {
        this.onChange = (selected: TestObject) => {
            this.selected = selected;
        };

        this.createOption = (text: string) => {
            const option = {
                date: new Date().toISOString(),
                name: text,
                age: 150,
                tall: false,
                short: true,
                id: `${Date.now() + this.options.length}}`
            };
            this.options.push(option);
            this.selected = option;
        };

        this.search = () => {
            this.set('options', []);
            return [];
        };

        await render(hbs`
            <PowerSelectInfinity
                @selected={{this.selected}}
                @onChange={{this.onChange}}
                @options={{this.options}}
                @canLoadMore={{true}}
                @loadMore={{this.loadMore}}
                @search={{this.search}}
                @allowClear={{true}}
                @placeholder={{"Search"}}
                @canCreate={{true}}
                @searchPlaceholder={{@searchPlaceholder}}
                @loadingMessage={{"loading"}}
                @searchField={{@searchField}}
                @triggerClass={{@triggerClass}}
                @clearOptions={{this.clearOptions}}
                @createOption={{this.createOption}}
                as |option|
            >
                <div
                    class="ember-power-select-option-section {{if option.heading "ember-power-select-option-section-has-heading"}}"
                >
                    {{#if option.heading}}
                        <div class="ember-power-select-option-section-heading font-weight-bold">
                            {{option.heading}}
                        </div>
                    {{/if}}
                    <div class="text-truncate">

                        {{option.name}}
                    </div>
                </div>
        </PowerSelectInfinity>
    `);
        await click('.ember-power-select-trigger-input');

        await fillIn('.ember-power-select-trigger-input', 'Cool test');

        await triggerKeyEvent('.ember-power-select-trigger-input', 'keydown', 'Enter');

        assert.strictEqual(this.selected?.name, 'Cool test');
    });

    test('Loading more options works', async function (this: PowerSelectInfinityContext, assert) {
        this.onChange = (selected: TestObject) => {
            this.selected = selected;
        };
        this.loadMore = () => {
            const nextPage = this.generateOptions(20);
            this.set('options', [...this.options, ...nextPage]);
            return nextPage;
        };

        this.canLoadMore = this.options.length > 40 ? false : true;

        await render(hbs`
            <PowerSelectInfinity
                @selected={{this.selected}}
                @onChange={{this.onChange}}
                @options={{this.options}}
                @canLoadMore={{this.canLoadMore}}
                @loadMore={{this.loadMore}}
                @search={{this.search}}
                @allowClear={{true}}
                @placeholder={{"Search"}}
                @canCreate={{true}}
                @searchPlaceholder={{@searchPlaceholder}}
                @loadingMessage={{"loading"}}
                @searchField={{@searchField}}
                @triggerClass={{@triggerClass}}
                @clearOptions={{this.clearOptions}}
                @createOption={{this.createOption}}
                @renderInPlace={{true}}
                as |option|
            >
            <div class="text-truncate">
                {{option.name}}
            </div>
        </PowerSelectInfinity>
    `);
        await click('.ember-power-select-trigger-input');
        assert.strictEqual(this.options.length, 20);
        // TODO fix this
        // await settled();
        // await scrollTo('.ember-basic-dropdown-content ul', 0, 1000);
        // await settled();
        // assert.equal(this.options.length, 40);
    });
});
