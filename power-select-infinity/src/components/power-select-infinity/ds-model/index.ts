import { getOwner } from '@ember/application';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { didCancel, task } from 'ember-concurrency';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import ModelRegistry from 'ember-data/types/registries/model';

import { Select } from '@gavant/glint-template-types/types/ember-power-select/components/power-select';

import type { PowerSelectInfinityArgs } from '../';

export interface PowerSelectInfinityModelArgs<K extends keyof ModelRegistry, T extends ModelRegistry[K], E>
    extends Omit<PowerSelectInfinityArgs<T, E>, 'options' | 'canLoadMore'> {
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
    modelName: K;
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
    sort?: string[];
}

export interface QueryParamsObj {
    [x: string]: any;
}

interface PowerSelectInfinityModelSignature<K extends keyof ModelRegistry, T extends ModelRegistry[K], E> {
    Args: PowerSelectInfinityModelArgs<K, T, E>;
    Blocks: {
        default: [T, Select];
    };
    Element: HTMLElement;
}

export default class PowerSelectInfinityModel<
    K extends keyof ModelRegistry,
    T extends ModelRegistry[K],
    E
> extends Component<PowerSelectInfinityModelSignature<K, T, E>> {
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
            function (this: PowerSelectInfinityModel<K, T, E>, term, offset) {
                return this.removeEmptyQueryParams({
                    filter: {
                        ...this.args.filters,
                        [this.searchParamKey]: this.useSearchParamFilter ? term : null
                    },
                    page: {
                        limit: this.pageSize,
                        offset: offset || 0
                    },
                    include: this.args.include?.join(',') ?? undefined,
                    sort: this.args.sort?.join(',') ?? undefined
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

    get modelType(): any {
        return this.store.modelFor(this.args.modelName);
    }

    get store(): any {
        return (getOwner(this) as any).lookup('service:store');
    }

    /**
     * Load the initial page of results if necessary.
     * @param {unknown} owner
     * @param {PowerSelectInfinityModelArgs<T>} args
     */
    constructor(owner: unknown, args: PowerSelectInfinityModelArgs<K, T, E>) {
        super(owner, args);
        if (this.loadOptionsOnRender) {
            scheduleOnce('afterRender', this, this.loadInitialPage);
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
    loadOptions = task(this, { restartable: true }, async (keyword?: string, offset = 0): Promise<T[] | Error> => {
        try {
            const params = this.processQueryParams(keyword, offset);

            const result = await this.store.query(this.args.modelName, params);
            const results = result.toArray();
            this.canLoadMore = results.length >= this.pageSize;
            return results;
        } catch (errors) {
            if (!didCancel(errors)) {
                return errors as Error;
            } else {
                return [];
            }
        }
    });

    /**
     * Loads the initial page of options.
     *
     * @return {Promise<any[]>}
     * @method loadInitialPage
     */
    @action
    async loadInitialPage(): Promise<T[] | Error> {
        const results = (await this.search('')) ?? [];
        if (!(results instanceof Error)) {
            this.options = results;
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
    async onSearch(keyword: string): Promise<T[] | Error> {
        const result = await this.search(keyword);
        return result;
    }

    /**
     * Searches for records matching the given keyword.
     *
     * @param {string} keyword
     * @return {Promise<any[]>}
     * @method search
     */
    @action
    async search(keyword: string): Promise<T[] | Error> {
        try {
            const results = (await this.loadOptions.perform(keyword)) ?? [];
            if (!(results instanceof Error)) {
                this.options = results;
            }
            return results;
        } catch (errors) {
            return errors as Error;
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
        const nextPage = await this.loadOptions.perform(keyword, offset);
        if (!(nextPage instanceof Error)) {
            options.push(...nextPage);
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
