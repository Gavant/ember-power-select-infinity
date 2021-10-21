import { getOwner } from '@ember/application';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { didCancel, TaskGenerator } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';

import { PowerSelectInfinityArgs } from '@gavant/ember-power-select-infinity/components/power-select-infinity';

import Result, { err, ok } from 'true-myth/result';

export interface PowerSelectInfinityModelArgs<T> extends PowerSelectInfinityArgs<T> {
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

export interface QueryParamsObj {
    [x: string]: any;
}

export default class PowerSelectInfinityModel<T> extends Component<PowerSelectInfinityModelArgs<T>> {
    @tracked canLoadMore = true;
    @tracked options: T[] = [];

    get loadOptionsOnRender() {
        return this.args.loadOptionsOnRender ?? true;
    }

    get pageSize() {
        return this.args.pageSize ?? 25;
    }

    get processQueryParams() {
        return (
            this.args.processQueryParams ??
            function (this: PowerSelectInfinityModel<T>, term, offset) {
                return this.removeEmptyQueryParams({
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
        );
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
     * @param {PowerSelectInfinityModelArgs<T>} args
     */
    constructor(owner: unknown, args: PowerSelectInfinityModelArgs<T>) {
        super(owner, args);
        if (this.loadOptionsOnRender) {
            scheduleOnce('afterRender', this, 'loadInitialPage');
        }
    }

    /**
     * Remove empty query params for api call
     *
     * @param {QueryParamsObj} queryParams
     * @return {*}  {QueryParamsObj}
     * @memberof PowerSelectInfinityModel
     */
    removeEmptyQueryParams(queryParams: QueryParamsObj): QueryParamsObj {
        for (const i in queryParams) {
            if (isEmpty(queryParams[i])) {
                delete queryParams[i];
            }
        }
        return queryParams;
    }

    /**
     * Queries the server for models.
     *
     * @param {PowerSelectInfinityModel} this
     * @param {string} term
     * @param {number} [offset]
     * @return {Promise<DS.Model[]>}
     * @method loadOptions
     */
    @restartableTask
    *loadOptions(keyword?: string, offset = 0): TaskGenerator<Result<T[], Error>> {
        try {
            const params = this.processQueryParams(keyword, offset);

            const result = yield this.store.query(this.args.modelName, params);
            const results = result.toArray();
            this.canLoadMore = results.length >= this.pageSize;
            return ok(results);
        } catch (errors) {
            if (!didCancel(errors)) {
                return err(errors);
            } else {
                return ok([]);
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
    async loadInitialPage(): Promise<Result<T[], Error>> {
        const results = (await this.search('')) ?? [];
        if (results.isOk()) {
            this.options = results.value;
        }
        return results;
    }

    /**
     * Action called from power select infinity. This must return an array of search values
     *
     * @param {string} keyword
     * @return {*}  {Promise<T[]>}
     * @memberof PowerSelectInfinityModel
     */
    @action
    async onSearch(keyword: string): Promise<T[]> {
        const result = await this.search(keyword);
        return result.isOk() ? result.value : [];
    }

    /**
     * Searches for records matching the given keyword.
     *
     * @param {string} keyword
     * @return {Promise<any[]>}
     * @method search
     */
    @action
    async search(keyword: string): Promise<Result<T[], Error>> {
        try {
            const results = (await taskFor(this.loadOptions).perform(keyword)) ?? [];
            if (results.isOk()) {
                this.options = results.value;
            }
            return results;
        } catch (errors) {
            return errors;
        }
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
        if (nextPage.isOk()) {
            options.push(...nextPage.value);
            this.options = options;
        }
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
