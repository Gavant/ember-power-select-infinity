// BEGIN-SNIPPET power-select-infinity-trigger-search.ts
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { restartableTask } from 'ember-concurrency-decorators';
import { didCancel } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';

interface PowerSelectInfinityTriggerLoadingArgs {}

export default class PowerSelectInfinityTriggerLoading extends Component<PowerSelectInfinityTriggerLoadingArgs> {
    @tracked canLoadMore: boolean = true;
    @tracked pageSize: number = 20;
    @tracked options: any[] = [];

    /**
     * This is where you would query the server for more options.
     *
     * @param {BasicPowerSelect} this
     * @param {(string | null)} term
     * @param {number} [offset]
     * @returns {Promise<any[]>}
     */
    @restartableTask
    *loadOptions(this: PowerSelectInfinityTriggerLoading, term: string, offset: number = 0) {
        try {
            yield new Promise((r) => setTimeout(r, 500));
            const newRows: any[] = [];
            if (term.match(/d|r|o|i|d/g)) {
                for (let i = offset; i <= offset + 10; i++) {
                    newRows.push({
                        date: new Date().toISOString(),
                        name: `Droid ${i}`,
                        age: 150,
                        tall: false,
                        short: true,
                        id: `${Date.now() + i}`
                    });
                }
                return newRows.concat([]);
            } else {
                return newRows;
            }
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

    @action
    clearOptions() {
        this.options = [];
    }
}
// END-SNIPPET
