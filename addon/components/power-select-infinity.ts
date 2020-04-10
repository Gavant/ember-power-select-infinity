import PowerSelect, { PowerSelectArgs, Select, SelectActions } from 'ember-power-select/components/power-select';
import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import { getOwner } from '@ember/application';
import { tracked } from '@glimmer/tracking';

interface PromiseProxy<T> extends Promise<T> {
    content: any
}

interface InfinitySelectActions extends SelectActions {
    onScroll: (term: string) => void
}

export interface InfinitySelect extends Select {
    text: string
    loading: boolean
    actions: InfinitySelectActions
}

export interface InfinityArgs extends PowerSelectArgs {
    loadingComponent?: string
    canLoadMore?: boolean
    onScroll?: (term: string, select: InfinitySelect) => any[] | PromiseProxy<any[]>
    buildSelection?: (selected: any, select: InfinitySelect) => any
    onChange: (selection: any, select: InfinitySelect, event?: Event) => void
    search?: (term: string, select: InfinitySelect) => any[] | PromiseProxy<any[]>
    onOpen?: (select: InfinitySelect, e: Event) => boolean | undefined
    onClose?: (select: InfinitySelect, e: Event) => boolean | undefined
    onInput?: (term: string, select: InfinitySelect, e: Event) => string | false | void
    onKeydown?: (select: InfinitySelect, e: KeyboardEvent) => boolean | undefined
    onFocus?: (select: InfinitySelect, event: FocusEvent) => void
    onBlur?: (select: InfinitySelect, event: FocusEvent) => void
    scrollTo?: (option: any, select: InfinitySelect) => void
    registerAPI?: (select: InfinitySelect) => void
}

export default class PowerSelectInfinityComponent extends PowerSelect<InfinityArgs> {
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
    async handleFocus(select: InfinitySelect) {
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
    handleInput(term: string, select: InfinitySelect, e: InputEvent): void {
        if (e.target === null) return;
        this.search(term, select);
    }

    @action
    handleKeydown(select: InfinitySelect, e: KeyboardEvent) {
        if (this.args.onKeydown && this.args.onKeydown(select, e) === false) {
            return false;
        }
        return this._routeKeydown(select, e);
    }

    @action
    search(term: string, select: InfinitySelect) {
        this.canLoadMore = true;
        if (isBlank(term)) {
            select.lastSearchedText = "";
            select.searchText = "";
            select.loading = false;
        } else if (this.args.search) {
            return this.args.search(term, select);
        } else {
            return this._filter(this.options, term);
        }
    }

    @action
    async onScroll(select: InfinitySelect) {
        if (this.canLoadMore && this.args.loadMore) {
            select.loading = true;
            let term = select.lastSearchedText;
            await this.args.loadMore([term, this]).then((results: []) => {
                select.lastSearchedText = term;
                select.loading = false;
            }).catch(() => {
                select.lastSearchedText = term;
                select.loading = false;
            });
        }
    }
}
