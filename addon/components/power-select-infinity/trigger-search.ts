import { action } from '@ember/object';
import { next, scheduleOnce } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Select } from 'ember-power-select/addon/components/power-select';
import { PowerSelectTriggerArgs } from 'ember-power-select/components/power-select/trigger';

import { PowerSelectInfinityExtra } from '@gavant/ember-power-select-infinity/components/power-select-infinity';

const KEYCODE_BACKSPACE = 8;
const KEYCODE_UP_ARROW = 38;
const KEYCODE_DOWN_ARROW = 40;
const KEYCODE_0 = 48;
const KEYCODE_Z = 90;
const KEYCODE_SPACE = 32;
const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

export default class PowerSelectInfinityTriggerSearch<T> extends Component<
    PowerSelectTriggerArgs<T, PowerSelectInfinityExtra>
> {
    oldSelect: Select | null = null;
    @tracked text = '';

    get canClear() {
        return this.text && !this.args.select.disabled;
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
                scheduleOnce('afterRender', null, newSelect.actions.close, null, true);
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
    //@ts-ignore
    handleKeydown(e: KeyboardEvent) {
        // up or down arrow and if not open, no-op and prevent parent handlers from being notified
        if ([KEYCODE_UP_ARROW, KEYCODE_DOWN_ARROW].indexOf(e.keyCode) > -1 && !this.args.select.isOpen) {
            e.stopPropagation();
            return;
        }
        const isLetter = (e.keyCode >= KEYCODE_0 && e.keyCode <= KEYCODE_Z) || e.keyCode === KEYCODE_SPACE; // Keys 0-9, a-z or SPACE
        // if isLetter, escape or enter, prevent parent handlers from being notified
        if (isLetter || [KEYCODE_ENTER, KEYCODE_ESCAPE].indexOf(e.keyCode) > -1) {
            const select = this.args.select;
            // open if loading msg configured
            if (!select.isOpen && this.args.loadingMessage) {
                scheduleOnce('afterRender', null, select.actions.open);
            }
            e.stopPropagation();
        }

        if (e.keyCode === KEYCODE_BACKSPACE && this.args.select.selected) {
            const select = this.args.select;
            e.stopPropagation();
            if (select.selected) {
                select.actions.select(undefined);
            }
            scheduleOnce('afterRender', null, select.actions.search, '');
            scheduleOnce('afterRender', null, select.actions.open);
        }

        if (e.keyCode === KEYCODE_ENTER && this.args.extra?.showCreateMessage && this.args.extra.createOption) {
            this.args.extra.createOption(this.args.select.searchText);
        }

        // optional, passed from power-select
        const onkeydown = this.args.onKeydown;
        if (onkeydown && onkeydown(e) === false) {
            return false;
        }
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
