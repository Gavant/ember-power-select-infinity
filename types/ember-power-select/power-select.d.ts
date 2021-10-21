import { PowerSelectArgs as PSArgs } from 'ember-power-select/addon/components/power-select';
import { PowerSelectAPI } from 'ember-power-select/types/power-select-api';

import { Modify } from '@gavant/ember-power-select-infinity/utils/typescript';

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
    selected: T | PromiseProxy<T>;
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
