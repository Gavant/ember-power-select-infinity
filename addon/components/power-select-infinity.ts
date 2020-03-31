import PowerSelectComponent from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import { task } from 'ember-concurrency-decorators';
import { getOwner } from '@ember/application';
import { timeout } from 'ember-concurrency';

interface PowerSelectInfinityPowerSelectInfinityArgs {
    loadMore: (keyword: string | null) => [];
    canLoadMore: boolean;
    renderInPlace: boolean;
    loadingComponent: string | null;
    triggerClass: string | null;
    loading: boolean;
    searchText: string;
    lastSearchedText: string;
}

export default class PowerSelectInfinityPowerSelectInfinity extends PowerSelectComponent<PowerSelectInfinityPowerSelectInfinityArgs> {
    searchDebounceDelay: number = 300;
    bufferSize: number = 0;
    estimateHeight: number = 12;
    staticHeight: boolean = true;
    @tracked loading: boolean = false;
    @tracked searchText: string = '';
    @tracked lastSearchedText = '';

    get fastboot() {
        return getOwner(this).lookup(`service:fastboot`);
    }

    get loadingComponent() {
        return this.args.loadingComponent;
    }

    get triggerClass() {
        return this.args.triggerClass ?? 'form-control';
    }
1
    /**
     * Invokes the loadMore action when the bottom of the options list is reached
     * @return {Promise}
     */
    @action
    async onLastReached() {
        if (this.loading || !this.args.canLoadMore) {
            return;
        }
        try {
            this.loading = true;
            const result = await this.args.loadMore(this.searchText);
            this.loading = false;
            return result;
        } catch (error) {
            this.loading = false;
            throw error;
        }
    }

}
