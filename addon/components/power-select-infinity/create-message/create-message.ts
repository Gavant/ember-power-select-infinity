import Component from '@glimmer/component';

import { PowerSelectBeforeOptionsArgs } from 'ember-power-select/components/power-select/before-options';

import { PowerSelectInfinityExtra } from '@gavant/ember-power-select-infinity/components/power-select-infinity/power-select-infinity';

type PowerSelectInfinityCreateMessageArgs<T> = PowerSelectBeforeOptionsArgs<T, PowerSelectInfinityExtra>;

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class PowerSelectInfinityCreateMessage<T> extends Component<PowerSelectInfinityCreateMessageArgs<T>> {}
