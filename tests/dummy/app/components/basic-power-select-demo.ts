interface Model {}
// BEGIN-SNIPPET basic-power-select-demo.ts
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { restartableTask } from 'ember-concurrency-decorators';
import { scheduleOnce } from '@ember/runloop';
import { didCancel } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import Ember from 'ember';

interface BasicPowerSelectArgs {}

export default class BasicPowerSelect extends Component<BasicPowerSelectArgs> {
    @tracked canLoadMore: boolean = true;
    @tracked pageSize: number = 20;
    @tracked options: Model[] = [];

    constructor(owner: unknown, args: BasicPowerSelectArgs) {
        super(owner, args);
        if (!Ember.testing) {
            scheduleOnce('afterRender', this, 'loadInitialPage');
        }
    }

    /**
     * This is where you would query the server for more options.
     *
     * @param {BasicPowerSelect} this
     * @param {(string | null)} term
     * @param {number} [offset]
     * @returns {Promise<Model[]>}
     */
    @restartableTask
    *loadOptions(this: BasicPowerSelect, term: string, offset: number = 0) {
        try {
            const params = {
                filter: {
                    keyword: term
                },
                page: {
                    limit: this.pageSize,
                    offset: offset || 0
                }
            };
            const result = yield this.store.query('model-name', params);
            const models = result.toArray();
            this.canLoadMore = models.length >= this.pageSize;
            return models;
        } catch (errors) {
            if (!didCancel(errors)) {
                this.notifications.groupErrors(errors);
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
    async loadInitialPage(): Promise<Model[]> {
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
    async search(keyword: string): Promise<Model[]> {
        const options = await taskFor(this.loadOptions).perform(keyword);
        this.options = options;
        return options;
    }

    /**
     * Loads the next page of records matching the given keyword
     *
     * @param {string} keyword
     * @returns {Promise<Model[]>}
     */
    @action
    async loadMore(keyword: string): Promise<Model[]> {
        const options = this.options.concat([]);
        const offset = options.length;
        const nextPage = await taskFor(this.loadOptions).perform(keyword, offset);
        options.push(...nextPage);
        this.options = options;
        return options;
    }
}
// END-SNIPPET
