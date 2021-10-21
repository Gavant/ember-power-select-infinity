import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class IndexController extends Controller {
    @tracked selectedItem: any | null = null;

    @action
    selectItem(newItem: any | null) {
        this.selectedItem = newItem ?? null;
    }
}
