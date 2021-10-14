import Component from '@glimmer/component';

import { PowerSelectBeforeOptionsArgs } from 'ember-power-select/components/power-select/before-options';

import { PowerSelectInfinityExtra } from '@gavant/ember-power-select-infinity/components/power-select-infinity';

interface PowerSelectInfinityCreateMessageArgs<T> extends PowerSelectBeforeOptionsArgs<T, PowerSelectInfinityExtra> {}

export default class PowerSelectInfinityCreateMessage<T> extends Component<PowerSelectInfinityCreateMessageArgs<T>> {}
