import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import Ember from 'ember';
import { didCancel } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';

interface BasicPowerSelectArgs {}

export default class BasicPowerSelect extends Component<BasicPowerSelectArgs> {
    @tracked canLoadMore: boolean = true;
    @tracked pageSize: number = 20;
    @tracked options: any[] = [
        {
            date: new Date().toISOString(),
            name: `New row 0`,
            age: 150,
            tall: false,
            short: true,
            id: `${Date.now() + 0}`
        }
    ];

    constructor(owner: unknown, args: BasicPowerSelectArgs) {
        super(owner, args);
        // if (!Ember.testing) {
        //     scheduleOnce('afterRender', this, 'loadInitialPage');
        // }
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
    *loadOptions(this: BasicPowerSelect, term: string, offset: number = 0) {
        // try {
        //     const params: ModelParameters = {
        //         filter: {
        //             keyword: term
        //         },
        //         page: {
        //             limit: this.pageSize,
        //             offset: offset || 0
        //         }
        //     };
        //     const result = yield this.store.query('model-name', params);
        //     const models = result.toArray();
        //     this.canLoadMore = models.length >= this.pageSize;
        //     return models;
        // } catch (errors) {
        //     if (!didCancel(errors)) {
        //         this.notifications.groupErrors(errors);
        //         throw errors;
        //     }
        // }
        try {
            yield new Promise((r) => setTimeout(r, 500));
            const newRows: any[] = [];
            for (let i = offset; i <= offset + 10; i++) {
                newRows.push({
                    date: new Date().toISOString(),
                    name: `${term ? term : 'New row'} ${i}`,
                    age: 150,
                    tall: false,
                    short: true,
                    id: `${Date.now() + i}`
                });
            }
            return newRows.concat([]);
        } catch (errors) {
            if (!didCancel(errors)) {
                throw errors;
            }
            return [];
        }
    }

    /**
     * Loads the initial page of options.
     *
     * @returns {Promise<any[]>}
     */
    @action
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
        const options = (await taskFor(this.loadOptions).perform(keyword, 10)) ?? [];
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

    @action
    onChange() {}
}
