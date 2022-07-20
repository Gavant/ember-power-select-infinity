import { PowerSelectArgs, Select } from '../../power-select';

declare module 'ember-power-select/components/power-select/after-options' {
    export type PowerSelectAfterOptionsArgs<T, E> = Pick<PowerSelectArgs<T, E>, 'extra'> & {
        select: Select;
    };
}
