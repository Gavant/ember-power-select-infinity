import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { didCancel } from 'ember-concurrency';
import { restartableTask } from 'ember-concurrency-decorators';
import { taskFor } from 'ember-concurrency-ts';

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

export default class BasicPowerSelect extends Component<Record<string, unknown>> {
    @tracked selected = null;
    @tracked canLoadMore = true;
    @tracked pageSize = 20;
    @tracked data: any[] = [];
    @tracked options: any[] = [];

    constructor(owner: unknown, args: Record<string, unknown>) {
        super(owner, args);

        this.data = generateOptions(100);
        this.options = this.data;
        // this.selected = this.options[0];
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
    *loadOptions(this: BasicPowerSelect, _term: string, offset = 0) {
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
        const options = this.data.concat([]);
        const offset = options.length;
        const nextPage = await taskFor(this.loadOptions).perform(keyword, offset);
        options.push(...nextPage);
        this.data = options;
        return options;
    }

    @action
    onChange(item: any) {
        this.selected = item;
    }

    @action
    createOption(text: string) {
        const newOption = generateOptions(1);
        newOption[0].name = text;
        this.data = [...this.data, ...newOption];
        this.selected = newOption[0];
    }
}
