import { click, render, TestContext, waitFor } from '@ember/test-helpers';

import { Server } from 'ember-cli-mirage/index';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';

import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import Person from 'test-app/models/person';

interface Context extends TestContext {
    server: Server;
    selected: Person | undefined;
    onChange: (selected: Person) => void;
}

module('Integration | Component | power-select-infinity/ds-model', function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    // This freezes the test for some reason
    // test('Selecting an option works', async function (this: Context, assert) {
    //     await this.server.createList('person' as never, 50);

    //     this.onChange = (selected: Person) => {
    //         this.selected = selected;
    //     };

    //     await render(hbs`
    //     <PowerSelectInfinity::DsModel
    //         @modelName="person"
    //         @selected={{this.selected}}
    //         @onChange={{this.onChange}}
    //         @placeholder="Select a person"
    //         @searchPlaceholder="Search for people..."
    //         @triggerClass="form-control"
    //         as |option|
    //     >
    //         <div class="text-truncate">
    //             {{option.name}}
    //         </div>
    //     </PowerSelectInfinity::DsModel>
    // `);

    //     await click('.ember-power-select-trigger-input');
    //     await waitFor('.ember-power-select-options-list');
    //     await click('.ember-power-select-options-list li');

    //     assert.strictEqual(this.selected?.name, 'person 0');
    // });
});
