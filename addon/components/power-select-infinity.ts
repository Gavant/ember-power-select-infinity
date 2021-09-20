import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { isBlank, isEmpty } from '@ember/utils';
import { tracked } from '@glimmer/tracking';

import Component from '@glimmer/component';
import { didCancel, restartableTask, TaskCancelation, timeout } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import { Select } from 'ember-power-select/addon/components/power-select';
import { PowerSelectComponentArgs } from 'ember-power-select/power-select';

export interface PowerSelectInfinityArgs<T> extends PowerSelectComponentArgs<T> {
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
    loadMore: (keyword: string | null) => Promise<any[]>;
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
    search: (keyword: string | null) => Promise<any[]>;
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
    /**
     * Determines whether the search box renders inside the options or not.
     */
    searchBelow?: boolean;
}

export default class PowerSelectInfinity<T> extends Component<PowerSelectInfinityArgs<T>> {
    get allowClear() {
        return this.args.allowClear ?? true;
    }

    get bufferSize() {
        return this.args.bufferSize ?? 5;
    }

    get canLoadMore() {
        return this.args.canLoadMore ?? true;
    }

    get estimateHeight() {
        return this.args.estimateHeight ?? 30;
    }

    get loadingComponent() {
        return this.args.loadingComponent ?? 'power-select-infinity/loading';
    }

    get matchTriggerWidth() {
        return this.args.matchTriggerWidth ?? true;
    }

    get noMatchesMessage() {
        return this.args.noMatchesMessage ?? 'No results found';
    }

    get optionsComponent() {
        return this.args.optionsComponent ?? 'power-select-infinity/options';
    }

    get search() {
        return this.args.search ?? false;
    }

    get searchBelow() {
        return this.args.searchBelow ?? true;
    }

    get searchDebounceDelay() {
        return this.args.searchDebounceDelay ?? 300;
    }

    get searchEnabled() {
        return this.args.searchEnabled ?? true;
    }

    get searchField() {
        return this.args.searchField ?? undefined;
    }

    get staticHeight() {
        return this.args.staticHeight ?? 0;
    }

    get tabindex() {
        return this.args.tabindex ?? '-1';
    }

    get triggerIsSearch() {
        return this.args.triggerIsSearch ?? false;
    }

    @tracked isLoadingMore = false;
    @tracked loading = false;
    @tracked searchText = '';
    @tracked hasInvokedSearch = false;

    get triggerComponent() {
        return this.args.triggerComponent !== undefined
            ? this.args.triggerComponent
            : this.triggerIsSearch
            ? 'power-select-infinity/trigger-search'
            : '';
    }

    get triggerClass() {
        return this.args.triggerIsSearch
            ? `power-select-infinity-trigger-is-search ${this.args.triggerClass}`
            : this.args.triggerClass;
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
     * This is required for glint to get the correct type.
     * (breaks TS when referencing this.searchTask.isRunning directly, for example)
     *
     * @readonly
     */
    get task() {
        return taskFor(this.searchTask);
    }

    /**
     * The delayed search task for the power select.
     *
     * @param {(string | null)} term
     * @method searchTask
     * @private
     */
    @restartableTask
    private *searchTask(term: string) {
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
     * @return {Promise<T[]>}
     * @method onSearch
     * @private
     */
    @action
    onSearch(term: string): Promise<T[]> {
        this.hasInvokedSearch = true;
        return taskFor(this.searchTask).perform(term);
    }

    /**
     * Invokes the loadMore action when the bottom of the options list is reached
     *
     * @return {(Promise<T[] | void | TaskCancelation>)}
     * @method onLastReached
     * @public
     */
    @action
    async onLastReached(): Promise<T[] | void | TaskCancelation> {
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

    /**
     * Clear the current search text.
     *
     */
    @action
    clearSearch() {
        this.searchText = '';
    }

    /**
     * Clears the search and results on blur if necessary.
     *
     * @param {Select} select
     * @param {FocusEvent} event
     */
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
}
