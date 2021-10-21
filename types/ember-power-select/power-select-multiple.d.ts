import { PowerSelectAPI } from 'ember-power-select/types/power-select-api';

import { Modify } from '@gavant/ember-power-select-infinity/utils/typescript';

type PowerSelectMultipleAPI<T> = Modify<PowerSelectAPI<T>, { selected: T[] }>;

export interface PromiseProxy<T> extends Promise<T> {
    content: any;
}
export type MatcherFn = (option: any, text: string) => number;
interface PowerSelectArgs<T> {
    highlightOnHover?: boolean;
    placeholderComponent?: string;
    searchMessage?: string;
    noMatchesMessage?: string;
    matchTriggerWidth?: boolean;
    options: T[] | Promise<T[]>;
    selected: T[] | Promise<T[]>;
    closeOnSelect?: boolean;
    defaultHighlighted?: any;
    searchField?: string;
    searchEnabled?: boolean;
    tabindex?: number | string;
    triggerComponent?: string;
    matcher?: MatcherFn;
    initiallyOpened?: boolean;
    typeAheadOptionMatcher?: MatcherFn;
    placeholder?: string;
    searchPlaceholder?: string;
    renderInPlace?: boolean;
    disabled?: boolean;
    loadingMessage?: boolean;
    canLoadMore?: boolean;
    allowClear?: boolean;
    triggerClass?: string;
    dropdownClass?: string;
    optionsComponent?: string;
    beforeOptionsComponent?: string;
    extra?: any;
    verticalPosition?: 'below' | 'above' | 'auto';
    selectedItemComponent?: string;
    loadMore?: (keyword?: string) => Promise<T[]>;
    buildSelection?: (selected: any, select: PowerSelectMultipleAPI<T>) => any;
    onChange: (selection: any, select: PowerSelectMultipleAPI<T>, event?: Event) => void;
    search?: (term: string, select: PowerSelectMultipleAPI<T>) => any[] | Promise<T[]>;
    onOpen?: (select: PowerSelectMultipleAPI<T>, e: Event) => boolean | undefined;
    onClose?: (select: PowerSelectMultipleAPI<T>, e: Event) => boolean | undefined;
    onInput?: (term: string, select: PowerSelectMultipleAPI<T>, e: Event) => string | false | void;
    onKeydown?: (select: PowerSelectMultipleAPI<T>, e: KeyboardEvent) => boolean | undefined;
    onFocus?: (select: PowerSelectMultipleAPI<T>, event: FocusEvent) => void;
    onBlur?: (select: PowerSelectMultipleAPI<T>, event: FocusEvent) => void;
    scrollTo?: (option: any, select: PowerSelectMultipleAPI<T>) => void;
    registerAPI?: (select: PowerSelectMultipleAPI<T>) => void;
}
