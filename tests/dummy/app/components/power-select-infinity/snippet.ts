import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { inject as service } from '@ember/service';
// BEGIN-SNIPPET basic-power-select-snippet.ts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import Model from '@ember-data/model';
import Store from '@ember-data/store';
import Ember from 'ember';
import { didCancel } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';

export default class BasicPowerSelect extends Component<Record<string, unknown>> {
    @service declare store: Store;
    @tracked canLoadMore = true;
    @tracked pageSize = 20;
    @tracked options: Model[] = [];

    constructor(owner: unknown, args: Record<string, unknown>) {
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
    *loadOptions(this: BasicPowerSelect, term: string, offset = 0) {
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const result = yield this.store.query('model-name', params);
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
