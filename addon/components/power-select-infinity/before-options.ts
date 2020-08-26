import BeforeOptionsComponent from 'ember-power-select/components/power-select/before-options';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { Select } from 'ember-power-select/addon/components/power-select';

interface Args {
    select: Select;
    onKeydown: (e: Event) => false | void;
    autofocus?: boolean;
}

interface BeforeOptionsArgs extends Args {
    extra: { [x: string]: any };
}

export default class BeforeOptions extends BeforeOptionsComponent<BeforeOptionsArgs> {
    @action
    clearSearch(): void {
        if (this.args.extra.clearSearch) {
            scheduleOnce('actions', this.args.select.actions, 'search', '');
        }
    }
}
