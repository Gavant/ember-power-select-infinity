import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { restartableTask } from 'ember-concurrency-decorators';
import { scheduleOnce } from '@ember/runloop';
import { didCancel } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import { dontRunInFastboot, argDefault } from '@gavant/ember-power-select-infinity/decorators/power-select-infinity';
import { removeEmptyQueryParams } from '@gavant/ember-power-select-infinity/utils';
import { getOwner } from '@ember/application';
import { dontRunInTests } from '@gavant/ember-power-select-infinity/decorators/power-select-infinity';

interface PowerSelectInfinityForModelArgs {
    filters?: { [x: string]: any };
    modelName: string;
    pageSize?: number;
    useKeyword?: boolean;
    processQueryParams?: (...args: any[]) => { [x: string]: any };
}

export default class PowerSelectInfinityForModel extends Component<PowerSelectInfinityForModelArgs> {
    @tracked canLoadMore: boolean = true;
    @tracked options: any[] = [];

    @argDefault useSearchParamFilter: boolean = true;
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

    get modelType() {
        return this.store.modelFor(this.args.modelName);
    }

    get store() {
        return getOwner(this).lookup('service:store');
    }

    constructor(owner: unknown, args: PowerSelectInfinityForModelArgs) {
        super(owner, args);
        scheduleOnce('afterRender', this, 'loadInitialPage');
    }

    /**
     * This is where you would query the server for more options.
     *
     * @param {BasicPowerSelect} this
     * @param {(string | null)} term
     * @param {number} [offset]
     * @returns {Promise<any[]>}
     */
    @restartableTask
    *loadOptions(this: PowerSelectInfinityForModel, term: string, offset: number = 0) {
        try {
            const params = this.processQueryParams(term, offset);
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
     * @returns {Promise<any[]>}
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
     * @returns {Promise<any[]>}
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
     * @returns {Promise<any[]>}
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
