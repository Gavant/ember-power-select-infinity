import Component from '@glimmer/component';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Ignore import
import { PowerSelectBeforeOptionsArgs } from 'ember-power-select/components/power-select/before-options';

import { PowerSelectInfinityExtra } from '../';

type PowerSelectInfinityCreateMessageArgs<T> = PowerSelectBeforeOptionsArgs<T, PowerSelectInfinityExtra>;

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class PowerSelectInfinityCreateMessage<T> extends Component<PowerSelectInfinityCreateMessageArgs<T>> {}
