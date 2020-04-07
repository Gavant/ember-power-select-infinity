import PowerSelect from 'ember-power-select/components/power-select';
import { action, get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { isEmpty, isBlank } from '@ember/utils';
import { getOwner } from '@ember/application';

export default class PowerSelectInfinityComponent extends PowerSelect {
    tagName = '';
    tabindex = -1;
    allowClear = true;
    triggerComponent = 'power-select-infinity/trigger';
    optionsComponent = 'power-select-infinity/options';
    loadingComponent = 'power-select-infinity/loading';
    beforeOptionsComponent = null;
    searchEnabled = false;
    searchField = 'name';
    loadingMessage = null;
    noMatchesMessage = null;
    estimateHeight = 28;
    bufferSize = 5;
    staticHeight = false;
    mustShowSearchMessage = false;
    canLoadMore = true;

    get fastboot() {
        return getOwner(this).lookup(`service:fastboot`);
    }

    get concatenatedTriggerClasses() {
        let classes = ['ember-power-select-infinity-trigger'];
        let passedClass = this.args.triggerClass;
        if (passedClass) {
            classes.push(passedClass);
        }
        return classes.join(' ');
    }

    get concatenatedDropdownClasses() {
        let classes = ['ember-power-select-infinity-dropdown'];
        let passedClass = this.args.dropdownClass;
        if (passedClass) {
            classes.push(passedClass);
        }
        return classes.join(' ');
    }

    get estimateHeight() {
        return this.args.estimateHeight || this.estimateHeight;
    }

    get staticHeight() {
        return this.args.staticHeight || this.staticHeight;
    }

    get inputClass() {
        return this.args.inputClass;
    }

    get searchField() {
        return this.args.searchField || this.searchField;
    }

    @action
    async handleFocus(select) {
        await select.actions.search(select.searchText);
    }

    @action
    onKeyDown(select, e) {
        let keyAction = this.onkeydown;

        // if user passes `onkeydown` action
        if (!keyAction || keyAction(select, e) !== false) {
            // if escape, then clear out selection
            if (e.keyCode === 27) {
                select.actions.choose(null);
            }
        }
    }

    @action
    search(term) {
        this.canLoadMore = true;
        if (isBlank(term)) {
            this.loading = false;
        } else if (this.args.search) {
            return this._performSearch(term);
        } else {
            return this._filter(term);
        }
    }

    @action
    onScroll() {
        if (this.canLoadMore) {
            this.loading = true;
            let term = this.lastSearchedText;
            this.args.loadMore(term).then(results => {
                this._filter(results, term);
                this.loading = false;
                this.canLoadMore = results.length !== 0;
            }).catch(() => {
                this.lastSearchedText = term;
                this.loading = false;
            });
        }
    }
}

function toPlainArray(collection) {
    if (collection) {
        return collection.toArray ? collection.toArray() : collection;
    } else {
        return [];
    }
}
