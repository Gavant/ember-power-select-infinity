import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { restartableTask } from 'ember-concurrency-decorators';
import { scheduleOnce } from '@ember/runloop';
import { didCancel } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import { removeEmptyQueryParams } from '@gavant/ember-pagination/utils/query-params';
import { getOwner } from '@ember/application';
import { PowerSelectInfinityArgs } from 'portal-app/pods/components/power-select-infinity/component';
import { dontRunInFastboot } from '@gavant/ember-power-select-infinity/decorators/power-select-infinity';

export interface PowerSelectInfinityForModelArgs<T> extends PowerSelectInfinityArgs<T> {
    /**
     * An object containing additional query filters.
     *
     * @type {{ [x: string]: any }}
     * @argument filters
     */
    filters?: { [x: string]: any };
    /**
     * The name of the ember-data model to query.
     *
     * @type {string}
     * @argument modelName
     */
    modelName: string;
    /**
     * The limit used for queries
     *
     * @type {number}
     * @argument pageSize [25]
     */
    pageSize?: number;
    /**
     *  The method used to process the query params
     *
     * @type {(...args: any[]) => { [x: string]: any }}
     * @argument processQueryParams
     */
    processQueryParams?: (...args: any[]) => { [x: string]: any };
    /**
     * The query-param used for string searches
     *
     * @type {string}
     * @argument searchParamKey [keyword]
     */
    searchParamKey?: string;
    /**
     * Whether or not to use the string search parameter.
     *
     * @type {boolean}
     * @argument useSearchParamFilter [true]
     */
    useSearchParamFilter?: boolean;
    /**
     * Whether or not the dropdown options are loaded on component render
     *
     * @type {boolean}
     */
    loadOptionsOnRender?: boolean;
    include?: string[];
}

export default class PowerSelectInfinityForModel<T> extends Component<PowerSelectInfinityForModelArgs<T>> {
    @tracked canLoadMore: boolean = true;
    @tracked options!: any[];

    get loadOptionsOnRender() {
        return this.args.loadOptionsOnRender ?? true;
    }

    get pageSize() {
        return this.args.pageSize ?? 25;
    }

    get searchParamKey() {
        return this.args.searchParamKey ?? 'keyword';
    }

    get useSearchParamFilter() {
        return this.args.useSearchParamFilter ?? true;
    }

    get modelType() {
        return this.store.modelFor(this.args.modelName);
    }

    get store() {
        return getOwner(this).lookup('service:store');
    }

    /**
     * Load the initial page of results if necessary.
     * @param {unknown} owner
     * @param {PowerSelectInfinityForModelArgs<T>} args
     */
    constructor(owner: unknown, args: PowerSelectInfinityForModelArgs<T>) {
        super(owner, args);
        if (this.loadOptionsOnRender) {
            scheduleOnce('afterRender', this, 'loadInitialPage');
        }
    }

    /**
     * Processes the query params using
     * gavant-ember-pagination utility methods.
     *
     * @param {string} term
     * @param {number} offset
     */
    processQueryParams(term: string, offset: number) {
        return removeEmptyQueryParams({
            filter: {
                ...this.args.filters,
                [this.searchParamKey]: this.useSearchParamFilter ? term : null
            },
            page: {
                limit: this.pageSize,
                offset: offset || 0
            },
            include: this.args.include ?? undefined
        });
    }

    /**
     * Queries the server for models.
     *
     * @param {PowerSelectInfinityForModel} this
     * @param {string} term
     * @param {number} [offset]
     * @return {Promise<DS.Model[]>}
     * @method loadOptions
     */
    @restartableTask
    *loadOptions(this: PowerSelectInfinityForModel<T>, term: string, offset: number = 0) {
        try {
            const params =
                this.args.processQueryParams?.(term, offset, this.searchParamKey, this.args.filters) ??
                this.processQueryParams(term, offset);
            const result = yield this.store.query(this.args.modelName, params);
            const models = result.toArray();
            this.canLoadMore = models.length >= this.pageSize;
            return models;
        } catch (errors) {
            if (!didCancel(errors)) {
                throw errors;
            }
        }
    }

    /**
     * Loads the initial page of options.
     *
     * @return {Promise<any[]>}
     * @method loadInitialPage
     */
    @action
    @dontRunInFastboot
    async loadInitialPage(): Promise<any[]> {
        const options = (await this.search('')) ?? [];
        this.options = options;
        return options;
    }

    /**
     * Searches for records matching the given keyword.
     *
     * @param {string} keyword
     * @return {Promise<any[]>}
     * @method search
     */
    @action
    async search(keyword: string): Promise<any[]> {
        const options = (await taskFor(this.loadOptions).perform(keyword)) ?? [];
        this.options = options;
        return options;
    }

    /**
     * Loads the next page of records matching the given keyword
     *
     * @param {string} keyword
     * @return {Promise<any[]>}
     * @method loadMore
     */
    @action
    async loadMore(keyword: string): Promise<any[]> {
        const options = this.options.concat([]);
        const offset = options.length;
        const nextPage = await taskFor(this.loadOptions).perform(keyword, offset);
        options.push(...nextPage);
        this.options = options;
        return options;
    }

    /**
     * Clear the current options.
     *
     */
    @action
    clearOptions() {
        this.options = [];
    }
}
