import OptionsComponent, { Args } from 'ember-power-select/components/power-select/options';
import { InfinitySelect } from '../power-select-infinity';
import layout from '../../templates/power-select/options';
import { setComponentTemplate } from '@ember/component';
import { action } from '@ember/object';

interface InfinityArgs extends Args {
    select: InfinitySelect
}

class PowerSelectInfinityOptionsComponent extends OptionsComponent<InfinityArgs> {
    @action
    onScroll() {
        const selectObject: InfinitySelect = this.args.select;
        this.args.select.actions.onScroll(selectObject);
    }
}

export default setComponentTemplate(layout, PowerSelectInfinityOptionsComponent);
