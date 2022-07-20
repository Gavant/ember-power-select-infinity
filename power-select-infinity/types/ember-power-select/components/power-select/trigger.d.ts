import { PowerSelectArgs, Select } from '../../power-select';

declare module 'ember-power-select/components/power-select/trigger' {
    export type PowerSelectTriggerArgs<T, E> = Pick<
        PowerSelectArgs<T, E>,
        | 'allowClear'
        | 'buildSelection'
        | 'loadingMessage'
        | 'selectedItemComponent'
        | 'searchEnabled'
        | 'searchField'
        | 'extra'
        | 'placeholder'
        | 'placeholderComponent'
    > & {
        listboxId: string;
        select: Select;
        onFocus: (event: Event) => void;
        onBlur: (select: Select, event: Event) => void;
        onInput: (event: Event) => void;
        onKeydown: (event: Event) => boolean;
    };
}
