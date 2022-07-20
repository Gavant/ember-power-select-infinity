import { PowerSelectArgs, Select } from '../../power-select';

declare module 'ember-power-select/components/power-select/before-options' {
    export type PowerSelectBeforeOptionsArgs<T, E> = Pick<
        PowerSelectArgs<T, E>,
        'searchEnabled' | 'placeholder' | 'extra' | 'selectedItemComponent' | 'searchPlaceholder'
    > & {
        listboxId: string;
        select: Select;
        onFocus: (event: Event) => void;
        onBlur: (select: Select, event: Event) => void;
        onInput: (event: Event) => void;
        onKeydown: (event: Event) => boolean;
    };
}
