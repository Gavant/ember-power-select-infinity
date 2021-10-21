import Component from '@glimmer/component';

import { Select } from 'ember-power-select/addon/components/power-select';
import { PowerSelectArgs } from 'ember-power-select/power-select';
import { PowerSelectAPI } from 'ember-power-select/types/power-select-api';

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
