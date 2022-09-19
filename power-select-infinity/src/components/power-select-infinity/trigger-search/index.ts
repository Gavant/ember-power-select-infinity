import { action } from '@ember/object';
import { next, scheduleOnce } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Ignore import
import { Select } from 'ember-power-select/components/power-select';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Ignore import
import { PowerSelectTriggerArgs } from 'ember-power-select/components/power-select/trigger';

import { PowerSelectInfinityExtra } from '../';

const KEY_BACKSPACE = 'Backspace';
const KEY_UP_ARROW = 'ArrowUp';
const KEY_DOWN_ARROW = 'ArrowDown';
const KEY_0 = '0';
const KEY_9 = '9';
const KEY_A = 'A';
const KEY_Z = 'Z';
const KEY_SPACE = ' ';
const KEY_ENTER = 'Enter';
const KEY_ESCAPE = 'Escape';

export default class PowerSelectInfinityTriggerSearch<T> extends Component<
    PowerSelectTriggerArgs<T, PowerSelectInfinityExtra>
> {
    oldSelect: Select | null = null;
    @tracked text = this.getSelectedAsText();

    get canClear() {
        return this.text && this.args.extra?.allowClear && !this.args.select.disabled;
    }

    /**
     * When any select attributes are updated, save the new one and compare against the old
     *
     * @return {*}
     * @memberof PowerSelectInfinityTriggerSearch
     */
    @action
    onSelectUpdate() {
        const oldSelect = this.oldSelect;
        const newSelect = this.args.select;
        this.oldSelect = newSelect;
        if (!oldSelect) {
            return;
        }

        if (oldSelect?.isOpen && !newSelect.isOpen && newSelect.searchText) {
            const input: HTMLInputElement | null = document.querySelector(
                `#ember-power-select-infinity-input-${newSelect.uniqueId}`
            );
            const newText = this.getSelectedAsText();
            if (input && input?.value !== newText) {
                input.value = newText;
            }
            this.text = newText;
        }

        if (newSelect.lastSearchedText !== oldSelect?.lastSearchedText) {
            if (newSelect.lastSearchedText === '') {
                scheduleOnce('afterRender', null, newSelect.actions.close, undefined, true);
            } else {
                scheduleOnce('afterRender', null, newSelect.actions.open);
            }
        }

        if (oldSelect?.selected !== newSelect.selected) {
            this.text = this.getSelectedAsText();
        }
    }

    /**
     * `handleKeydown` isn't an action in the original component
     * and is invoked from the template through this action.
     *
     * @param {KeyboardEvent} e
     */

    @action
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Not all codepaths should return values
    handleKeydown(e: KeyboardEvent) {
        // up or down arrow and if not open, no-op and prevent parent handlers from being notified
        if ([KEY_UP_ARROW, KEY_DOWN_ARROW].indexOf(e.key) > -1 && !this.args.select.isOpen) {
            e.stopPropagation();
            return;
        }
        const isLetter =
            (e.key.length === 1 && ((e.key >= KEY_0 && e.key <= KEY_9) || (e.key >= KEY_A && e.key <= KEY_Z))) ||
            e.key === KEY_SPACE; // Keys 0-9, a-z or SPACE
        // if isLetter, escape or enter, prevent parent handlers from being notified
        if (isLetter || [KEY_ENTER, KEY_ESCAPE].indexOf(e.key) > -1) {
            const select = this.args.select;
            // open if loading msg configured
            if (!select.isOpen && this.args.loadingMessage) {
                scheduleOnce('afterRender', null, select.actions.open);
            }
            e.stopPropagation();
            // Prevent Enter from submitting forms
            if (e.key === KEY_ENTER) {
                e.preventDefault();
            }
        }

        if (e.key === KEY_BACKSPACE && this.args.select.selected) {
            const select = this.args.select;
            e.stopPropagation();
            if (select.selected) {
                select.actions.select(undefined);
            }
            scheduleOnce('afterRender', null, select.actions.search, '');
            scheduleOnce('afterRender', null, select.actions.open);
        }

        if (e.key === KEY_ENTER && this.args.extra?.showCreateMessage && this.args.extra.createOption) {
            const select = this.args.select;
            this.args.extra.createOption(select.searchText);
            scheduleOnce('afterRender', null, select.actions.close);
        }

        // optional, passed from power-select
        const onkeydown = this.args.onKeydown;
        if (onkeydown && onkeydown(e) === false) {
            return false;
        }
    }

    @action
    onFocus(select: Select) {
        scheduleOnce('afterRender', null, select.actions.search, '');
        scheduleOnce('afterRender', null, select.actions.open);
    }

    /**
     * obtains selected value based on complex object or primitive value from power-select publicAPI
     *
     * @private
     * @method getSelectedAsText
     */
    getSelectedAsText() {
        const labelPath = this.args.extra?.labelPath ?? 'name';
        const selected = this.args.select.selected;
        let value = undefined;
        if (selected) {
            if (labelPath) {
                // complex object
                value = this.args.select.selected[labelPath];
            } else {
                // primitive value
                value = this.args.select.selected;
            }
        }
        return value;
    }

    /**
     * Clear the search
     *
     * @memberof PowerSelectInfinityTriggerSearch
     */
    @action
    clear() {
        next(this, () => {
            this.args.select.actions.select(null);
        });
    }

    /**
     * Clears the search and results on blur if necessary.
     *
     * @param {Select} select
     * @param {FocusEvent} event
     */
    @action
    onBlur(select: Select, event: FocusEvent) {
        if (this.args.extra?.clearSearchOnBlur) {
            scheduleOnce('afterRender', null, select.actions.search, '');
            scheduleOnce('afterRender', null, select.actions.open);
            this.text = '';
        }
        this.args.onBlur?.(select, event);
    }
}
