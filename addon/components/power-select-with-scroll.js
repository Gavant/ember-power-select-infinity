import PowerSelect from 'ember-power-select/components/power-select';
import { countOptions } from 'ember-power-select/utils/group-utils';
import { get, set } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import { isBlank } from '@ember/utils';
import { scheduleOnce } from '@ember/runloop';

function toPlainArray(collection) {
    if (collection) {
        return collection.toArray ? collection.toArray() : collection;
    } else {
        return [];
    }
}

export default PowerSelect.extend({
    mustShowSearchMessage: false,
    canLoadMore: true,
    actions: {
        search(term) {
          set(this, 'canLoadMore', true);
          if (isBlank(term)) {
              this.updateState({
                  results: toPlainArray(get(this, 'options')),
                  _rawSearchResults: get(this, 'options'),
                  resultsCount: countOptions(get(this, 'options')),
                  lastSearchedText: "",
                  loading: false
              });
              scheduleOnce('actions', this.get('publicAPI'), this.get('publicAPI.actions.open'));
          } else if (this.get('search')) {
            this._performSearch(term);
          } else {
            this._performFilter(term);
          }
        },
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
                    set(this, 'canLoadMore', get(results, 'length') !== 0);
                    this.resetHighlighted();
                }).catch(() => {
                    this.updateState({ lastSearchedText: term, loading: false });
                });
            }
        }
    },
    init() {
        this._super(...arguments);
        this._publicAPIActions.onScroll = (...args) => this.send('onScroll', ...args);
    }
});
