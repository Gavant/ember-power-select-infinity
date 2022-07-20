import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

// BEGIN-SNIPPET power-select-infinity-trigger-search-controller.ts
export default class PowerSelectInfinityTriggerWithLoad extends Controller {
    @tracked selectedItem: any = null;

    @action
    selectItem(newItem: any): void {
        this.selectedItem = newItem ?? null;
    }
}
// END-SNIPPET
