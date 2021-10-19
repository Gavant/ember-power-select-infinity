import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { didCancel } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';

interface BasicPowerSelectArgs {}

const generateOptions = (number: number) => {
    const newRows: any[] = [];
    for (let i = 0; i <= number - 1; i++) {
        newRows.push({
            date: new Date().toISOString(),
            name: `New row ${i}`,
            age: 150,
            tall: false,
            short: true,
            id: `${Date.now() + i}`
        });
    }
    return newRows;
};

export default class BasicPowerSelect extends Component<BasicPowerSelectArgs> {
    @tracked selected = null;
    @tracked canLoadMore: boolean = true;
    @tracked pageSize: number = 20;
    @tracked data: any[] = [];
    @tracked options: any[] = [];

    constructor(owner: unknown, args: BasicPowerSelectArgs) {
        super(owner, args);

        this.data = generateOptions(1000);
        this.options = this.data;
        // if (!Ember.testing) {
        //     scheduleOnce('afterRender', this, 'loadInitialPage');
        // }
    }

    /**
     * This is where you would query the server for more options.
     *
     * @param {BasicPowerSelect} this
     * @param {(string | null)} _term
     * @param {number} [offset]
     * @returns {Promise<any[]>}
     */
    @restartableTask
    *loadOptions(this: BasicPowerSelect, _term: string, offset: number = 0) {
        try {
            yield new Promise((r) => setTimeout(r, 500));
            const newRows: any[] = [];
            for (let i = offset; i <= offset + 10; i++) {
                newRows.push({
                    date: new Date().toISOString(),
                    name: `New row ${i}`,
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
     * Searches for records matching the given keyword.
     *
     * @param {string} keyword
     * @returns {Promise<any[]>}
     */
    @action
    async search(keyword: string): Promise<any[]> {
        const options = this.data.filter((option) => {
            return option.name.includes(keyword);
        });
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
    onChange(item: any) {
        this.selected = item;
    }
}
