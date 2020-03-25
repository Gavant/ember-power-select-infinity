import OptionsComponent from 'ember-power-select/components/power-select/options';
import layout from '../../templates/components/power-select-infinity/options';
import { action } from '@ember/object';

export default class Options extends OptionsComponent {
    layout;

    @action
    onScroll() {
        this.select.actions.onScroll();
    }
}
