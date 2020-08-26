import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

// BEGIN-SNIPPET power-select-infinity-trigger-with-load-controller.ts
export default class PowerSelectInfinityTriggerWithLoad extends Controller {
    @tracked selectedItem: any = null;

    @action
    selectItem(newItem: any) {
        this.selectedItem = newItem ?? null;
    }
}
// END-SNIPPET