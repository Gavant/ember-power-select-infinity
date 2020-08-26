import Trigger from 'ember-power-select/components/power-select-multiple/trigger';
import { Select } from 'ember-power-select/addon/components/power-select';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

interface PowerSelectTriggerWithLoadArgs {
    select: Select;
    listBoxId: number;
    placeholder: string;
    isLoading: boolean;
    onBlur(): void;
}

export default class PowerSelectTriggerWithLoad extends Trigger<PowerSelectTriggerWithLoadArgs> {
    @action
    onBlur() {
        scheduleOnce('actions', this.args.select.actions, 'search', '');
        this.args.onBlur();
    }
}
