import { PowerSelectArgs } from '@gavant/glint-template-types/types/ember-power-select/power-select';

declare module 'ember-power-select/power-select' {
    export interface PowerSelectComponentArgs<T> extends PowerSelectArgs<T> {}
}
