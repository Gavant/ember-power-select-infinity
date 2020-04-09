import PowerSelect, { PowerSelectArgs, Select } from 'ember-power-select/components/power-select';
import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import { getOwner } from '@ember/application';
import { tracked } from '@glimmer/tracking';

interface PromiseProxy<T> extends Promise<T> {
    content: any
}

export interface PowerSelectInfinityArgs extends PowerSelectArgs {
    loadingComponent?: string
    optionsComponent?: string
    beforeOptionsComponent?: string
    canLoadMore?: boolean
    allowClear?: boolean
    loadingMessage?: string;
    mustShowSearchMessage?: boolean;
    noMatchesMessage?: string
    searchField?: string
    searchEnabled?: boolean
    tabindex?: number | string
    triggerComponent?: string
    onChange: (selection: any, select: Select, event?: Event) => void
    search?: (term: string, select: Select) => any[] | PromiseProxy<any[]>
    onOpen?: (select: Select, e: Event) => boolean | undefined
    onClose?: (select: Select, e: Event) => boolean | undefined
    onInput?: (term: string, select: Select, e: Event) => string | false | void
    onKeydown?: (select: Select, e: KeyboardEvent) => boolean | undefined | void
    onFocus?: (select: Select, event: FocusEvent) => void
    onBlur?: (select: Select, event: FocusEvent) => void
}

export default class PowerSelectInfinityComponent extends PowerSelect<PowerSelectInfinityArgs> {
    @tracked private _resolvedOptions?: any[];

    tagName = '';
    tabindex = -1;
    allowClear = true;
    triggerComponent = 'power-select-infinity/trigger';
    optionsComponent = 'power-select-infinity/options';
    loadingComponent = 'power-select-infinity/loading';
    beforeOptionsComponent = null;
    searchEnabled = false;
    loadingMessage = null;
    noMatchesMessage = null;
    mustShowSearchMessage = false;
    canLoadMore = true;
    lastSearchedText = '';
    @tracked loading = false;

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
        return this.args.estimateHeight || 28;
    }

    get bufferSize() {
        return this.args.bufferSize || 5;
    }

    get staticHeight() {
        return this.args.staticHeight || false;
    }

    get inputClass() {
        return this.args.inputClass;
    }

    get searchField() {
        return this.args.searchField || 'name';
    }

    @action
    async handleFocus(select: Select) {
        await select.actions.search(select.searchText);
    }

    // @action
    // handleKeydown(select: Select, e: KeyboardEvent) {
    //     // if escape, then clear out selection
    //     if (e.keyCode === 27) {
    //         select.actions.choose(null);
    //     }
    // }

    @action
    handleInput(term: string, select: Select, e: InputEvent): void {
        if (e.target === null) return;
        this.search(term, select);
    }

    @action
    handleKeydown(select: Select, e: KeyboardEvent) {
        if (this.args.onKeydown && this.args.onKeydown(select, e) === false) {
            return false;
        }
        return this._routeKeydown(select, e);
    }

    @action
    search(term: string, select: Select) {
        this.canLoadMore = true;
        if (isBlank(term)) {
            this.loading = false;
        } else if (this.args.search) {
            return this._performSearch(select, term);
        } else {
            return this._filter(term);
        }
    }

    @action
    async onScroll() {
        if (this.canLoadMore && this.args.loadMore) {
            this.loading = true;
            let term = this.lastSearchedText;
            let currentResults = this.results;
            await this.args.loadMore(term).then((results: []) => {
                let plainArray = toPlainArray(results);
                let newResults = currentResults.concat(plainArray);
                this.lastSearchedText = term;
                this.loading = false;
                this.canLoadMore = results.length !== 0;
                this._resolvedOptions = newResults;
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
