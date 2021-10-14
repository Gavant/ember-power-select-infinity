// @ts-ignore it does too exist
import { setComponentTemplate } from '@ember/component';

import PowerSelectOptions from 'ember-power-select/components/power-select/options';

import { PowerSelectInfinityExtra } from '@gavant/ember-power-select-infinity/components/power-select-infinity';

// import Options from '@gavant/glint-template-types/types/ember-power-select/components/power-select/options';
// @ts-ignore its a template file - so ignore warning for now
// import Template from './options';

export default class PowerSelectInfinityOptions<T, E extends PowerSelectInfinityExtra> extends PowerSelectOptions<
    T,
    E
> {
    get estimateHeight() {
        return this.args.extra.estimateHeight ?? 30;
    }
}
// setComponentTemplate(Template, PowerSelectInfinityOptions);
