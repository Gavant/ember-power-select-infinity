import Component from '@glimmer/component';

import { PowerSelectArgs, Select } from '../../power-select';

declare module 'ember-power-select/components/power-select/options' {
    export type PowerSelectOptionsArgs<T, E> = Pick<
        PowerSelectArgs<T, E>,
        'loadingMessage' | 'options' | 'optionsComponent' | 'extra' | 'highlightOnHover' | 'groupComponent'
    > & {
        groupIndex?: '';
        listboxId: string;
        select: Select;
        extra: E;
    };

    export default class OptionsComponent<T, E> extends Component<PowerSelectOptionsArgs<T, E>> {
        addHandlers: () => void;
    }
}
