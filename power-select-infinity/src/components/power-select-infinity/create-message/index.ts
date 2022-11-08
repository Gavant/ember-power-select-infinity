import Component from '@glimmer/component';

import type { BeforeOptionsSignature } from '@gavant/glint-template-types/types/ember-power-select/components/power-select/before-options';

type Args<T> = BeforeOptionsSignature<T>['Args'];
type PowerSelectInfinityCreateMessageArgs<T> = Args<T>;

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export default class PowerSelectInfinityCreateMessage<T> extends Component<PowerSelectInfinityCreateMessageArgs<T>> {}
