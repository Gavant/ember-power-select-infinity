import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { didCancel, task } from 'ember-concurrency';

type Option = {
    date: string;
    name: string;
    age: number;
    tall: boolean;
    short: boolean;
    id: string;
};

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

export default class PowerSelectInfinityDemo extends Component<Record<string, unknown>> {
    @tracked selected: Option | null = null;
    @tracked canLoadMore = true;
    @tracked pageSize = 20;
    @tracked data: Option[] = [];
    @tracked options: Option[] = [];

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
     * @returns {Promise<Option[]>}
     */
    loadOptions = task(this, { restartable: true }, async (_term: string, offset = 0) => {
        try {
            await new Promise((r) => setTimeout(r, 500));
            const newRows: Option[] = [];
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
    });

    /**
     * Searches for records matching the given keyword.
     *
     * @param {string} keyword
     * @returns {Promise<any[]>}
     */
    @action
    search(keyword: string) {
        const options = this.data.filter((option) => {
            return option.name.toLowerCase().includes(keyword);
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
    async loadMore(keyword: string): Promise<Option[]> {
        const options = this.data.concat([]);
        const offset = options.length;
        const nextPage = await this.loadOptions.perform(keyword, offset);
        this.data = [...this.data, ...nextPage];
        options.push(...nextPage);
        this.options = options;
        return options;
    }

    @action
    onChange(item: Option) {
        this.selected = item;
    }

    @action
    createOption(text: string) {
        const newOption = generateOptions(1);
        newOption[0].name = text;
        this.data = [...this.data, ...newOption];
        this.options = [...this.options, ...newOption];
        this.selected = newOption[0];
    }
}

declare module '@glint/environment-ember-loose/registry' {
    export default interface Registry {
        'PowerSelectInfinity::Demo': typeof PowerSelectInfinityDemo;
    }
}
