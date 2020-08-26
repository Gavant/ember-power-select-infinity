import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { restartableTask } from 'ember-concurrency-decorators';
import { scheduleOnce } from '@ember/runloop';
import { didCancel } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import {
    dontRunInFastboot,
    argDefault,
    dontRunInTests
} from '@gavant/ember-power-select-infinity/decorators/power-select-infinity';
import { removeEmptyQueryParams } from '@gavant/ember-power-select-infinity/utils';
import { getOwner } from '@ember/application';
import { PowerSelectInfinityArgs } from '../power-select-infinity';

export interface PowerSelectInfinityForModelArgs extends PowerSelectInfinityArgs {
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
}

/**
 * Default ProcessQueryParams:
 * ```ts
 *     return removeEmptyQueryParams({
        filter: {
            ...this.args.filters,
            [this.searchParamKey]: this.useSearchParamFilter ? term : null
        },
        page: {
            limit: this.pageSize,
            offset: offset || 0
        }
    });
 * ```
 *
 * @export
 * @class PowerSelectInfinityForModel
 * @extends {GlimmerComponent<PowerSelectInfinityForModelArgs>}
 * @public
 */
export default class PowerSelectInfinityForModel extends Component<PowerSelectInfinityForModelArgs> {
    @tracked canLoadMore: boolean = true;
    @tracked options!: any[];

    @argDefault loadOptionsOnRender: boolean = true;
    @argDefault pageSize: number = 25;
    @argDefault processQueryParams: (...args: any[]) => { [x: string]: any } = function (
        this: PowerSelectInfinityForModel,
        term,
        offset
    ) {
        return removeEmptyQueryParams({
            filter: {
                ...this.args.filters,
                [this.searchParamKey]: this.useSearchParamFilter ? term : null
            },
            page: {
                limit: this.pageSize,
                offset: offset || 0
            }
        });
    };
    @argDefault searchParamKey: string = 'keyword';
    @argDefault useSearchParamFilter: boolean = true;

    get modelType() {
        return this.store.modelFor(this.args.modelName);
    }

    get store() {
        return getOwner(this).lookup('service:store');
    }

    constructor(owner: unknown, args: PowerSelectInfinityForModelArgs) {
        super(owner, args);
        if (this.loadOptionsOnRender) {
            scheduleOnce('afterRender', this, 'loadInitialPage');
        }
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
    *loadOptions(this: PowerSelectInfinityForModel, term: string, offset: number = 0) {
        try {
            const params = this.processQueryParams(term, offset, this.searchParamKey, this.args.filters);
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
    @dontRunInTests
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
}
