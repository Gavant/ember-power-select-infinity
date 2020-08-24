import Component from '@glimmer/component';
import { PowerSelectArgs } from 'ember-power-select/components/power-select';
import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import { dontRunInFastboot, argDefault } from '../decorators/power-select-infinity';
import { TaskGenerator, timeout, didCancel, TaskCancelation } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';

interface PowerSelectInfinityArgs extends PowerSelectArgs {
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
    @argDefault loadingBelow: boolean = true;
    @argDefault loadingComponent: string = 'power-select-infinity/loading';
    @argDefault matchTriggerWidth: boolean = true;
    @argDefault noMatchesMessage: string | null = null;
    @argDefault optionsComponent: string = 'power-select-infinity/options';
    @argDefault search: boolean = false;
    @argDefault searchBelow: boolean = true;
    @argDefault searchDebounceDelay: number = 300;
    @argDefault searchEnabled: boolean = true;
    @argDefault searchField: string | null = null;
    @argDefault staticHeight: boolean = false;
    @argDefault tabindex: number = -1;

    @tracked isLoadingMore: boolean = false;
    @tracked loading = false;
    @tracked searchText: string | null = null;

    get triggerComponent() {
        return this.args.triggerComponent ?? this.loadingBelow ? '' : 'power-select-infinity/trigger-with-load';
    }

    get beforeOptionsComponent() {
        return this.args.beforeOptionsComponent ?? this.loadingBelow ? undefined : null;
    }

    /**
     * The delayed search task for the power select.
     *
     * @param {(string | null)} term
     * @returns {TaskGenerator<any[]>}
     * @method searchTask
     * @private
     */
    @restartableTask
    private *searchTask(term: string | null): TaskGenerator<any[]> {
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
     * @returns {void}
     * @public
     */
    @action
    onSearchInput(term: string | null): void {
        this.searchText = term;

        // Since the search action is not invoked when the search term is blank,
        // invoke it manually, so that the options are reset
        if (isBlank(term)) {
            this.onSearch('');
        }
    }

    /**
     * Invokes the search action after a debounced delay when the user types in the search box
     * @param {(String | null)} term
     * @returns {Promise<any[]>}
     * @method onSearch
     * @private
     */
    @action
    onSearch(term: string | null): Promise<any[]> {
        return taskFor(this.searchTask).perform(term);
    }

    /**
     * Invokes the loadMore action when the bottom of the options list is reached
     *
     * @returns {(Promise<any[] | void | TaskCancelation>)}
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
}
