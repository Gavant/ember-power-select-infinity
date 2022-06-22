import PowerSelectOptions from 'ember-power-select/components/power-select/options';

import { PowerSelectInfinityExtra } from '@gavant/ember-power-select-infinity/components/power-select-infinity/power-select-infinity';

export default class PowerSelectInfinityOptions<T, E extends PowerSelectInfinityExtra> extends PowerSelectOptions<
    T,
    E
> {
    get estimateHeight() {
        return this.args.extra.estimateHeight ?? 30;
    }

    get renderAll() {
        return this.args.extra.renderAll ?? true;
    }
}
