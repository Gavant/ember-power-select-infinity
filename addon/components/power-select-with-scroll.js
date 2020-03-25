import PowerSelect from 'ember-power-select/components/power-select';
import { countOptions } from 'ember-power-select/utils/group-utils';
import { get, action } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { isBlank } from '@ember/utils';

function toPlainArray(collection) {
    if (collection) {
        return collection.toArray ? collection.toArray() : collection;
    } else {
        return [];
    }
}

export default class PowerSelectWithScrollComponent extends PowerSelect {
    mustShowSearchMessage = false;
    canLoadMore = true;

    constructor() {
        super(...arguments);
        this._publicAPIActions.onScroll = (...args) => this.send('onScroll', ...args);
    }

    @action
    search(term) {
        this.canLoadMore = true;
        if (isBlank(term)) {
            return this.updateState({
                results: toPlainArray(get(this, 'options')),
                _rawSearchResults: get(this, 'options'),
                resultsCount: countOptions(get(this, 'options')),
                lastSearchedText: "",
                loading: false
            });
        } else if (this.get('search')) {
            return this._performSearch(term);
        } else {
            return this._performFilter(term);
        }
    }

    @action
    onScroll() {
        if (get(this, 'canLoadMore')) {
            this.updateState({ loading: true });
            let term = get(this, 'publicAPI.lastSearchedText');
            let currentResults = get(this, 'publicAPI.results');
            tryInvoke(this, 'loadMore', [term, get(this, 'publicAPI')]).then(results => {
                let plainArray = toPlainArray(results);
                let newResults = currentResults.concat(plainArray);
                this.updateState({
                    results: newResults,
                    _rawSearchResults: newResults,
                    resultsCount: countOptions(newResults),
                    lastSearchedText: term,
                    loading: false
                });
                this.canLoadMore = get(results, 'length') !== 0;
                this.resetHighlighted();
            }).catch(() => {
                this.updateState({ lastSearchedText: term, loading: false });
            });
        }
    }
}
