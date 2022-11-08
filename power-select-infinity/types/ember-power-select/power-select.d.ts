import Component from '@glimmer/component';

import { Modify } from '../../src/utils/typescript';

import type {
    Dropdown,
    DropdownActions
} from '@gavant/glint-template-types/types/ember-basic-dropdown/components/basic-dropdown';

import type { PowerSelectAPI } from 'ember-power-select/types/power-select-api';

export type MatcherFn = (option: any, text: string) => number;
interface SelectActions extends DropdownActions {
    search: (term: string) => void;
    highlight: (option: any) => void;
    select: (selected: any, e?: Event) => void;
    choose: (selected: any, e?: Event) => void;
    scrollTo: (option: any) => void;
}
export interface Select extends Dropdown {
    selected: any;
    highlighted: any;
    options: any[];
    results: any[];
    resultsCount: number;
    loading: boolean;
    isActive: boolean;
    searchText: string;
    lastSearchedText: string;
    actions: SelectActions;
}
interface PromiseProxy<T> extends Promise<T> {
    content: any;
}
interface CancellablePromise<T> extends Promise<T> {
    cancel: () => void;
}
interface Arrayable<T> {
    toArray(): T[];
}
interface Performable {
    perform: (...args: any[]) => void;
}
// Some args are not listed here because they are only accessed from the template. Should I list them?
export interface PSArgs {
    highlightOnHover?: boolean;
    placeholderComponent?: string;
    searchMessage?: string;
    searchMessageComponent?: string;
    noMatchesMessage?: string;
    noMatchesMessageComponent?: string;
    matchTriggerWidth?: boolean;
    options: any[] | PromiseProxy<any[]>;
    selected: any | PromiseProxy<any>;
    closeOnSelect?: boolean;
    defaultHighlighted?: any;
    searchField?: string;
    searchEnabled?: boolean;
    tabindex?: number | string;
    triggerComponent?: string;
    beforeOptionsComponent?: string;
    optionsComponent?: string;
    groupComponent?: string;
    matcher?: MatcherFn;
    initiallyOpened?: boolean;
    typeAheadOptionMatcher?: MatcherFn;
    buildSelection?: (selected: any, select: Select) => any;
    onChange: (selection: any, select: Select, event?: Event) => void;
    search?: (term: string, select: Select) => any[] | PromiseProxy<any[]>;
    onOpen?: (select: Select, e: Event) => boolean | undefined;
    onClose?: (select: Select, e: Event) => boolean | undefined;
    onInput?: (term: string, select: Select, e: Event) => string | false | void;
    onKeydown?: (select: Select, e: KeyboardEvent) => boolean | undefined;
    onFocus?: (select: Select, event: FocusEvent) => void;
    onBlur?: (select: Select, event: FocusEvent) => void;
    scrollTo?: (option: any, select: Select) => void;
    registerAPI?: (select: Select) => void;
}

export interface PromiseProxy<T> extends Promise<T> {
    content: any;
}

type modifiedPSArgs<T> = Modify<
    PSArgs,
    { search?: (term: string, select: PowerSelectAPI<T>) => any[] | PromiseProxy<T[]> | Promise<T[]> }
>;

interface PowerSelectArgs<T, E> extends modifiedPSArgs<T> {
    ariaDescribedBy?: string;
    ariaInvalid?: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    required?: boolean;
    options: T[] | PromiseProxy<T[]>;
    selected: T | PromiseProxy<T> | null;
    placeholder?: string;
    searchPlaceholder?: string;
    renderInPlace?: boolean;
    disabled?: boolean;
    loadingMessage?: string;
    allowClear?: boolean;
    triggerClass?: string;
    dropdownClass?: string;
    triggerRole?: string;
    title?: string;
    triggerId?: string;
    optionsComponent?: string;
    beforeOptionsComponent?: string;
    afterOptionsComponent?: string;
    groupComponent?: string;
    extra?: E;
    preventScroll?: boolean;
    verticalPosition?: 'below' | 'above' | 'auto';
    horizontalPosition?: string;
    destination?: string;
    initiallyOpened?: boolean;
    ebdTriggerComponent?: string;
    ebdContentComponent?: string;
    triggerComponent?: string;
    tabindex?: number;
    eventType?: string;
    selectedItemComponent?: string;
    searchEnabled?: boolean;
    searchField?: string;
    calculatePosition?: () => string;
    buildSelection?: (selected: PowerSelectArgs<T, E>['selected'], select: PowerSelectAPI<T>) => any;
    onChange: (selection: PowerSelectArgs<T, E>['selected'], select: PowerSelectAPI<T>, event?: Event) => void;
    search?: (term: string, select: PowerSelectAPI<T>) => any[] | PromiseProxy<T[]> | Promise<T[]>;
    onOpen?: (select: PowerSelectAPI<T>, e: Event) => boolean | undefined;
    onClose?: (select: PowerSelectAPI<T>, e: Event) => boolean | undefined;
    onInput?: (term: string, select: PowerSelectAPI<T>, e: Event) => string | false | void;
    onKeydown?: (select: PowerSelectAPI<T>, e: KeyboardEvent) => boolean | undefined;
    onFocus?: (select: PowerSelectAPI<T>, event: FocusEvent) => void;
    onBlur?: (select: PowerSelectAPI<T>, event: FocusEvent) => void;
    scrollTo?: (option: PowerSelectArgs<T, E>['selected'], select: PowerSelectAPI<T>) => void;
    registerAPI?: (select: PowerSelectAPI<T>) => void;
}

interface PowerSelectSignature<T, E extends Record<string, unknown>> {
    Element: HTMLDivElement;
    Args: PowerSelectArgs<T, E>;
    Blocks: {
        default: [T, PowerSelectAPI<T>];
    };
}

// eslint-disable-next-line ember/no-empty-glimmer-component-classes
export declare class PowerSelect<T, E extends Record<string, unknown>> extends Component<PowerSelectSignature<T, E>> {}
