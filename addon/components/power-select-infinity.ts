import Component from '@glimmer/component';
import { Select } from 'ember-power-select/addon/components/power-select';
import { isEmpty } from '@ember/utils';
import { action, get } from '@ember/object';
import { isBlank } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import { argDefault } from '../decorators/power-select-infinity';
import { TaskGenerator, timeout, didCancel, TaskCancelation } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';
import { later } from '@ember/runloop';

function indexOfOption(collection: any, option: any): number {
    let index = 0;
    return (function walk(collection): number {
        if (!collection) {
            return -1;
        }
        for (let i = 0; i < get(collection, 'length'); i++) {
            let entry = collection.objectAt ? collection.objectAt(i) : collection[i];
            if (isGroup(entry)) {
                let result = walk(get(entry, 'options'));
                if (result > -1) {
                    return result;
                }
            } else if (entry === option) {
                return index;
            } else {
                index++;
            }
        }
        return -1;
    })(collection);
}

function isGroup(entry: any): boolean {
    return !!entry && !!get(entry, 'groupName') && !!get(entry, 'options');
}

interface PowerSelectArgs {
    afterOptionsComponent?: string;
    allowClear?: boolean;
    animationEnabled?: boolean;
    ariaDescribedBy?: string;
    ariaInvalid?: string;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    beforeOptionsComponent?: string;
    buildSelection?: (lastSelection: unknown, select: Select) => unknown | null;
    calculatePosition?: (
        trigger: HTMLElement,
        content: HTMLElement,
        destination: HTMLElement,
        options: CalculatePositionOptions
    ) => {
        horizontalPosition: HorizontalPositions;
        verticalPosition: VerticalPositions;
        style: PositionStyle;
    };
    class?: string;
    closeOnSelect?: boolean;
    defaultHighlighted?: unknown;
    destination?: string;
    disabled?: boolean;
    dropdownClass?: string;
    extra?: { [index: string]: any };
    groupComponent?: string;
    highlightOnHover?: boolean;
    horizontalPosition?: HorizontalPositions;
    intiallyOpened?: boolean;
    loadingMessage?: string;
    eventType?: string;
    matcher?: (option: unknown, searchTerm: string) => boolean;
    matchTriggerWidth?: boolean;
    noMatchesMessage?: string;
    onBlur?: (select: Select, event: FocusEvent) => void;
    onChange?: (selection: unknown, select: Selection, event?: Event) => void;
    onClose?: (select: Select, e: Event) => boolean | undefined;
    onFocus?: (select: Select, event: FocusEvent) => void;
    onInput?: (term: string, select: Select, e: Event) => string | false | void;
    onKeydown?: (select: Select, e: KeyboardEvent) => boolean | undefined;
    onOpen?: (select: Select, e: Event) => boolean | undefined;
    options: unknown[];
    optionsComponent?: string;
    placeholder?: string;
    placeholderComponent?: string;
    preventScroll?: boolean;
    registerAPI?: (select: Select) => void;
    renderInPlace?: boolean;
    scrollTo?: (option: unknown, select: Select) => void;
    search?: (term: string, select: Select) => any[] | Promise<unknown[]>;
    searchEnabled?: boolean;
    searchField?: string;
    searchMessage?: string;
    searchPlaceholder?: string;
    selected?: unknown | unknown[];
    selectedItemComponent?: string;
    tabindex?: string;
    triggerClass?: string;
    triggerComponent?: string;
    triggerId?: string;
    triggerRole?: string;
    typeAheadMatcher?: (option: unknown, searchTerm: string) => boolean;
    verticalPosition?: VerticalPositions;
}

interface CalculatePositionOptions {
    previousHorizontalPosition: HorizontalPositions;
    horizontalPosition: HorizontalPositions;
    previousVerticalPosition: VerticalPositions;
    verticalPosition: VerticalPositions;
    matchTriggerWidth: boolean;
    renderInPlace: boolean;
}

interface PositionStyle {
    top?: number;
    left?: number;
    right?: number;
    width?: number;
}

enum HorizontalPositions {
    LEFT = 'left',
    RIGHT = 'right',
    CENTER = 'center',
    AUTO = 'auto'
}

enum VerticalPositions {
    ABOVE = 'above',
    BELOW = 'below',
    AUTO = 'auto'
}

export interface PowerSelectInfinityArgs extends PowerSelectArgs {
    beforeOptionsComponent?: string;
    /**
     * Used by ember-vertical-collection for occlusion rendering.
     *
     * @type {number}
     * @argument bufferSize
     */
    bufferSize?: number;
    /**
     * Allow/disallow loading of more options when scrolling.
     *
     * @type {boolean}
     * @argument canLoadMore
     */
    canLoadMore: boolean;
    /**
     * Method used to clear the options.
     *
     * This should be passed in when using `triggerIsSearch`
     *
     * @type {() => any}
     * @argument clearOptions
     */
    clearOptions?: () => any;
    /**
     * Whether to clear the search text on blur or not.
     *
     * Defaults to `true` when `triggerIsSearch` is `true`.
     *
     * @type {boolean}
     * @argument clearSearchOnBlur
     */
    clearSearchOnBlur?: boolean;
    /**
     * The class for the dropdown options
     *
     * @type {string}
     * @argument dropdownClass
     */
    dropdownClass?: string;
    /**
     * Used by ember-vertical-collection for occlusion rendering.
     *
     * @type {number}
     * @argument estimateHeight
     */
    estimateHeight?: number;
    /**
     * The method invoked when `canLoadMore` is true and
     * the bottom of the list is reached.
     *
     * @type {(keyword: string | null) => any[]}
     * @argument loadMore
     */
    loadMore: (keyword: string | null) => any[];
    /**
     * The message shown when no options are returned.
     *
     * @type {string}
     * @argument noMatchesMessage
     */
    noMatchesMessage?: string;
    /**
     * The method invoked onBlur
     *
     * @type {(select: Select, event: FocusEvent) => void}
     * @argument onBlur
     */
    onBlur?: (select: Select, event: FocusEvent) => void;
    /**
     * The options displayed in the dropdown
     *
     * @type {any[]}
     * @argument options
     */
    options: any[];
    /**
     * The method invoked when searching.
     *
     * @type {(keyword: string | null) => any[]}
     * @argument search
     *
     */
    search: (keyword: string | null) => any[];
    /**
     * The delay for invoking the `@search` method
     * when typing.
     *
     * @type {number}
     * @argument searchDebounceDelay
     */
    searchDebounceDelay?: number;
    /**
     * Used by ember-vertical-collection for occlusion rendering.
     *
     * @type {boolean}
     * @argument staticHeight
     */
    staticHeight?: boolean;
    /**
     * The trigger-component for the power-select
     *
     * @type {string}
     * @argument triggerComponent
     */
    triggerComponent?: string;
    /**
     * Toggles the search being within the dropdown trigger.
     *
     * @type {boolean}
     * @argument triggerIsSearch
     */
    triggerIsSearch?: boolean;
}

/**
 * Simple Usage:
 * ```handlebars
 * <PowerSelectInfinity @onChange={{this.onChange}} />
 * ```
 *
 * @export
 * @class PowerSelectInfinity
 * @extends {Component<PowerSelectInfinityArgs>}
 * @public
 */
export default class PowerSelectInfinity extends Component<PowerSelectInfinityArgs> {
    @argDefault allowClear: boolean = true;
    @argDefault bufferSize: number = 5;
    @argDefault canLoadMore: boolean = true;
    @argDefault estimateHeight: number = 30;
    @argDefault loadingComponent: string = 'power-select-infinity/loading';
    @argDefault matchTriggerWidth: boolean = true;
    @argDefault noMatchesMessage: string = 'No results found';
    @argDefault optionsComponent: string = 'power-select-infinity/options';
    @argDefault search: boolean = false;
    @argDefault searchBelow: boolean = true;
    @argDefault searchDebounceDelay: number = 300;
    @argDefault searchEnabled: boolean = true;
    @argDefault searchField: string | null = null;
    @argDefault staticHeight: boolean = false;
    @argDefault tabindex: number = -1;
    @argDefault triggerIsSearch: boolean = false;

    @tracked isLoadingMore: boolean = false;
    @tracked loading = false;
    @tracked searchText: string = '';
    @tracked hasInvokedSearch: boolean = false;

    get triggerComponent() {
        return this.args.triggerComponent !== undefined
            ? this.args.triggerComponent
            : this.triggerIsSearch
            ? 'power-select-infinity/trigger-search'
            : '';
    }

    get beforeOptionsComponent() {
        return this.args.beforeOptionsComponent ?? this.triggerIsSearch ? null : 'power-select-infinity/before-options';
    }

    get dropdownClass() {
        if (this.triggerIsSearch) {
            const primarySearchActive = taskFor(this.searchTask).isRunning;
            const shouldHideDropdown = primarySearchActive || isEmpty(this.args.options);
            return `${shouldHideDropdown ? 'd-none' : ''} ${this.args.dropdownClass}`;
        } else {
            return this.args.dropdownClass;
        }
    }

    get clearSearchOnBlur() {
        return this.args.clearSearchOnBlur !== undefined ? this.args.clearSearchOnBlur : this.triggerIsSearch;
    }

    /**
     * The delayed search task for the power select.
     *
     * @param {(string | null)} term
     * @return {TaskGenerator<any[]>}
     * @method searchTask
     * @private
     */
    @restartableTask
    private *searchTask(term: string): TaskGenerator<any[]> {
        yield timeout(this.searchDebounceDelay);
        try {
            const results = this.args.search(term);
            return results;
        } catch (errors) {
            if (didCancel(errors)) {
                throw errors;
            }
            return errors;
        }
    }

    /**
     * Keeps track of the currently entered search input.
     *
     * @param {string | null} term
     * @method onSearchInput
     * @return {void}
     * @public
     */
    @action
    onSearchInput(term: string): void {
        this.searchText = term;

        // Since the search action is not invoked when the search term is blank,
        // invoke it manually, so that the options are reset
        if (isBlank(term) && !this.triggerIsSearch) {
            this.onSearch('');
        }
    }

    /**
     * Invokes the search action after a debounced delay when the user types in the search box
     * @param {(String | null)} term
     * @return {Promise<any[]>}
     * @method onSearch
     * @private
     */
    @action
    onSearch(term: string): Promise<any[]> {
        this.hasInvokedSearch = true;
        return taskFor(this.searchTask).perform(term);
    }

    /**
     * Invokes the loadMore action when the bottom of the options list is reached
     *
     * @return {(Promise<any[] | void | TaskCancelation>)}
     * @method onLastReached
     * @public
     */
    @action
    async onLastReached(): Promise<any[] | void | TaskCancelation> {
        if (this.isLoadingMore || !this.args.canLoadMore) {
            return;
        }
        try {
            this.isLoadingMore = true;
            const result = await this.args.loadMore(this.searchText);
            this.isLoadingMore = false;
            return result;
        } catch (errors) {
            this.isLoadingMore = false;
            if (!didCancel(errors)) {
                throw errors;
            }
            return errors;
        }
    }

    @action
    clearSearch() {
        this.searchText = '';
    }

    @action
    onBlur(select: Select, event: FocusEvent) {
        this.hasInvokedSearch = false;
        if (this.clearSearchOnBlur) {
            later(
                this,
                function (select: Select) {
                    if (!select.isActive) {
                        this.clearSearch();
                        this.args.clearOptions?.();
                    }
                },
                [select],
                100
            );
        }
        this.args.onBlur?.(select, event);
    }

    @action
    scrollTo(option: any, select: Select) {
        let optionsList = document.querySelector(
            `[aria-controls="ember-power-select-trigger-${select.uniqueId}"]`
        ) as HTMLElement;
        if (!optionsList) {
            return;
        }
        let index = indexOfOption(select.results, option);
        if (index === -1) {
            return;
        }
        let optionElement =
            (optionsList.querySelectorAll('[data-option-index]') as NodeListOf<HTMLElement>).item(index) ??
            optionsList.querySelector(`[data-option-index="${index}"]`);
        if (!optionElement) {
            return;
        }
        let optionTopScroll = optionElement.offsetTop - optionsList.offsetTop;
        let optionBottomScroll = optionTopScroll + optionElement.offsetHeight;
        if (optionBottomScroll > optionsList.offsetHeight + optionsList.scrollTop) {
            optionsList.scrollTop = optionBottomScroll - optionsList.offsetHeight;
        } else if (optionTopScroll < optionsList.scrollTop) {
            optionsList.scrollTop = optionTopScroll;
        }
    }
}

//     @action
//     scrollTo(option: any, select: Select) {
//         let optionsList = document.querySelector(
//             `[aria-controls="ember-power-select-trigger-${select.uniqueId}"]`
//         ) as HTMLElement;
//         if (!optionsList) {
//             return;
//         }
//         let index = indexOfOption(select.results, option);
//         if (index === -1) {
//             return;
//         }
//         let optionsArray = Array.from(optionsList.querySelectorAll('[data-option-index]')) as any[];
//         if (optionsArray.length) {
//             optionsArray.unshift(...Array(Number(optionsArray[0].attributes['data-option-index'].value)));
//             optionsArray = optionsArray.concat(
//                 ...Array.apply(null, Array(select.options.length - optionsArray.length)).map(function () {})
//             );
//         }
//         let optionElement = optionsArray[index];
//         if (!optionElement) {
//             return;
//         }
//         let optionTopScroll = optionElement.offsetTop - optionsList.offsetTop;
//         let optionBottomScroll = optionTopScroll + optionElement.offsetHeight;
//         if (optionBottomScroll > optionsList.offsetHeight + optionsList.scrollTop) {
//             optionsList.scrollTop = optionBottomScroll - optionsList.offsetHeight;
//         } else if (optionTopScroll < optionsList.scrollTop) {
//             optionsList.scrollTop = optionTopScroll;
//         }
//     }
