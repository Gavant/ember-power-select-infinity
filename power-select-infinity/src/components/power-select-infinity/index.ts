import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { didCancel, task, TaskCancelation, timeout } from 'ember-concurrency';

import { PowerSelectArgs, Select } from '@gavant/glint-template-types/types/ember-power-select/components/power-select';

import { ensureSafeComponent } from '@embroider/util';

import { guard } from '../../utils/typescript';
import PowerSelectInfinityCreateMessage from './create-message';
import PowerSelectInfinityLoading from './loading';
import PowerSelectInfinityOptions from './options';
import PowerSelectInfinityTriggerSearch from './trigger-search';

export type PowerSelectInfinityExtra = Pick<
    PowerSelectInfinityArgs<Record<string, unknown>, unknown>,
    | 'bufferSize'
    | 'labelPath'
    | 'clearSearchOnBlur'
    | 'estimateHeight'
    | 'staticHeight'
    | 'loadingComponent'
    | 'createOption'
    | 'allowClear'
    | 'renderAll'
    | 'triggerClass'
> & {
    /**
     *  Whether or not the user should be given the option to create if no options found
     *
     * @type {boolean}
     * @memberof PowerSelectInfinityExtra
     */
    showCreateMessage?: boolean;

    /**
     * Whether or not we are searching currently
     *
     * @type {boolean}
     * @memberof PowerSelectInfinityExtra
     */
    isSearching?: boolean;

    /**
     *
     *
     * @type {boolean}
     * @memberof PowerSelectInfinityExtra
     */
    isLoadingMore?: boolean;

    /**
     * On last reached, load more data
     *
     * @memberof PowerSelectInfinityExtra
     */
    onLastReached?: () => void;
};

export interface PowerSelectInfinityArgs<T, E> extends PowerSelectArgs<T> {
    /**
     * Used by ember-vertical-collection for occlusion rendering.
     *
     * @type {number}
     * @argument bufferSize
     * @memberof PowerSelectInfinityArgs
     */
    bufferSize?: number;

    /**
     * Whether or not the user can create an option when non are found for a search term
     *
     * @type {boolean}
     * @memberof PowerSelectInfinityArgs
     */
    canCreate?: boolean;
    /**
     * Allow/disallow loading of more options when scrolling.
     *
     * @type {boolean}
     * @argument canLoadMore
     * @memberof PowerSelectInfinityArgs
     */
    canLoadMore: boolean;

    /**
     * Whether to clear the search text on blur or not.
     *
     * Defaults to `true` when `triggerIsSearch` is `true`.
     *
     * @type {boolean}
     * @argument clearSearchOnBlur
     * @memberof PowerSelectInfinityArgs
     */
    clearSearchOnBlur?: boolean;

    /**
     * Used to create a new option
     *
     * @memberof PowerSelectInfinityArgs
     */
    createOption?: (text: string) => void;

    /**
     * Function given to control when we should show the create message
     *
     * @param {this} component
     * @memberof PowerSelectInfinityArgs
     */
    showCreateMessage?: (component: PowerSelectInfinity<T, E>) => void;

    /**
     * The message displayed to the user telling them they can create the option
     *
     * @type {string}
     * @memberof PowerSelectInfinityArgs
     */
    createMessage?: string;

    /**
     * Used by ember-vertical-collection for occlusion rendering.
     *
     * @type {number}
     * @argument estimateHeight
     * @memberof PowerSelectInfinityArgs
     */
    estimateHeight?: number;
    /**
     * Label path - the path of the object to display in the text box
     *
     * @type {string}
     * @memberof PowerSelectInfinityArgs
     */
    labelPath?: T extends object ? keyof T : any;

    /**
     * The loading component to display
     *
     * @type {string}
     * @memberof PowerSelectInfinityArgs
     */
    loadingComponent?: string;

    /**
     * The method invoked when `canLoadMore` is true and
     * the bottom of the list is reached.
     *
     * @type {(keyword: string | null) => any[]}
     * @argument loadMore
     * @memberof PowerSelectInfinityArgs
     */
    loadMore?: (keyword?: string) => Promise<T[]>;
    /**
     * The message shown when no options are returned.
     *
     * @type {string}
     * @argument noMatchesMessage
     * @memberof PowerSelectInfinityArgs
     */
    noMatchesMessage?: string;

    /**
     * The delay for invoking the `@search` method
     * when typing.
     *
     * @type {number}
     * @argument searchDebounceDelay
     * @memberof PowerSelectInfinityArgs
     */
    searchDebounceDelay?: number;
    /**
     * Used by ember-vertical-collection for occlusion rendering.
     *
     * @type {boolean}
     * @argument staticHeight
     * @memberof PowerSelectInfinityArgs
     */
    staticHeight?: boolean;

    /**
     * Used by ember-vertical-collection to determine if all
     * elements should be rendered or not.
     *
     * @type {boolean}
     */
    renderAll?: boolean;

    allowClear?: boolean;

    triggerClass?: string;

    dropdownClass?: string;
}

interface PowerSelectInfinitySignature<T, E> {
    Args: PowerSelectInfinityArgs<T, E>;
    Blocks: {
        default: [T, Select];
    };
    Element: HTMLElement;
}

export default class PowerSelectInfinity<T, E> extends Component<PowerSelectInfinitySignature<T, E>> {
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
        return ensureSafeComponent(this.args.loadingComponent, this) ?? PowerSelectInfinityLoading;
    }

    get matchTriggerWidth() {
        return this.args.matchTriggerWidth ?? true;
    }

    get noMatchesMessage() {
        return this.args.noMatchesMessage ?? 'No results found';
    }

    get optionsComponent() {
        return ensureSafeComponent(this.args.optionsComponent, this) ?? PowerSelectInfinityOptions;
    }

    get search() {
        return this.args.search ?? false;
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
        return this.args.staticHeight ?? false;
    }

    get tabindex() {
        return this.args.tabindex ?? -1;
    }

    @tracked isLoadingMore = false;
    @tracked loading = false;
    @tracked searchText = '';
    @tracked select: Select | null = null;

    get showCreateMessage() {
        if (this.args.showCreateMessage) {
            return this.args.showCreateMessage(this);
        } else {
            const searchText = this.select?.searchText;
            const numOptions = guard(this.args.options, 'content')
                ? this.args.options.content.length
                : this.args.options.length;
            return this.args.canCreate && numOptions === 0 && searchText !== '' && !this.searchTask.isRunning;
        }
    }

    get createMessage() {
        return this.args.createMessage ?? `Press enter to create the group "${this.select?.searchText}"`;
    }

    get triggerComponent() {
        return ensureSafeComponent(this.args.triggerComponent, this) ?? PowerSelectInfinityTriggerSearch;
    }

    get triggerClass() {
        return this.args.triggerClass ?? 'ember-power-select-infinity-trigger';
    }

    get beforeOptionsComponent() {
        if (this.showCreateMessage) {
            return this.args.beforeOptionsComponent ?? PowerSelectInfinityCreateMessage;
        }
        return null;
    }

    get dropdownClass() {
        return `${this.args.dropdownClass ?? ''} ember-power-select-infinity-dropdown ${
            this.searchTask.isRunning ? 'options-loading' : ''
        }`;
    }

    get clearSearchOnBlur() {
        return this.args.clearSearchOnBlur ?? false;
    }

    /**
     * The delayed search task for the power select.
     *
     * @param {(string | null)} term
     * @return {TaskGenerator<any[]>}
     * @method searchTask
     * @private
     */
    searchTask = task(this, { restartable: true }, async (term: string, select: Select) => {
        await timeout(this.searchDebounceDelay);
        try {
            return this.args.search?.(term, select);
        } catch (errors) {
            if (didCancel(errors)) {
                throw errors;
            }
            return errors as any;
        }
    });

    /**e
     * Keeps track of the currently entered search input.
     *
     * @param {string | null} term
     * @method onSearchInput
     * @return {void}
     * @public
     */
    @action
    onSearchInput(term: string, select: Select): void {
        this.searchText = term;

        // Since the search action is not invoked when the search term is blank,
        // invoke it manually, so that the options are reset
        if (isBlank(term)) {
            this.onSearch('', select);
        }
    }

    /**
     * Invokes the search action after a debounced delay when the user types in the search box
     * @param {(String)} term
     * @return {Promise<any[]>}
     * @method onSearch
     * @private
     */
    @action
    async onSearch(term: string, select: Select): Promise<any[]> {
        return this.searchTask.perform(term, select);
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
            const result = await this.args.loadMore?.(this.searchText);
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
     * Register the API so we can use the select in this component
     *
     * @param {Select} select
     * @memberof PowerSelectInfinity
     */
    @action
    registerAPI(select: Select) {
        this.select = select;
    }

    /**
     *  Create an option with the passed in text
     *
     * @param {string} text
     * @memberof PowerSelectInfinity
     */
    @action
    createOption(text: string) {
        this.args.createOption?.(text);
    }
}
