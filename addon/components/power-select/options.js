import OptionsComponent from 'ember-power-select/components/power-select/options';
import layout from '../../templates/power-select/options';
import { setComponentTemplate } from '@ember/component';
import { action } from '@ember/object';

class PowerSelectInfinityOptionsComponent extends OptionsComponent {
    @action
    onScroll() {
        this.args.onScroll();
    }
}

export default setComponentTemplate(layout, PowerSelectInfinityOptionsComponent);
