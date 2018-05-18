import PowerSelect from 'ember-power-select/components/power-select';
import { get } from '@ember/object';
import { tryInvoke } from '@ember/utils';

export default PowerSelect.extend({
    actions: {
        onTriggerFocus(){
            this._super(...arguments);
            this._performSearch('');
        },
        onScroll() {
            this.updateState({ loading: true });
            let term = get(this, 'publicAPI.lastSearchedText');
            let currentResults = get(this, 'publicAPI.results');
            tryInvoke(this, 'loadMore', [term, get(this, 'publicAPI')]).then(results => {
                let plainArray = results.toArray ? results.toArray() : results;
                let newResults = currentResults.concat(plainArray);
                this.updateState({
                    results: newResults,
                    _rawSearchResults: newResults,
                    resultsCount: plainArray.length,
                    lastSearchedText: term,
                    loading: false
                });
                this.resetHighlighted();
            }).catch(() => {
                this.updateState({ lastSearchedText: term, loading: false });
            });
        }
    },
    init() {
        this._super(...arguments);
        this._publicAPIActions.onScroll = (...args) => this.send('onScroll', ...args);
    }
});
