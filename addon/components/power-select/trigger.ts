import { Select } from 'ember-power-select/components/power-select';
import PowerSelectTrigger, { Args } from 'ember-power-select/components/power-select/trigger';
import { get, set, action } from '@ember/object';
import { isBlank, isEmpty } from '@ember/utils';
import { run, later } from '@ember/runloop';
import layout from '../../templates/power-select/trigger';
import { setComponentTemplate } from '@ember/component';
import { tracked } from '@glimmer/tracking';

const KEYCODE_BACKSPACE = 8;
const KEYCODE_UP_ARROW = 38;
const KEYCODE_DOWN_ARROW = 40;
const KEYCODE_0 = 48;
const KEYCODE_Z = 90;
const KEYCODE_SPACE = 32;
const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

interface InfinityArgs extends Args {
    select: Select
    onKeydown: (e: Event) => false | void
    autofocus?: boolean
}

class PowerSelectInfinityTriggerComponent extends PowerSelectTrigger<InfinityArgs> {
    tagName = '';
    @tracked _text = '';

    get concatenatedInputClasses() {
        let classes = ['ember-power-select-infinity-input'];
        let passedClass = this.args.inputClass;
        if (passedClass) {
            classes.push(passedClass);
        }
        return classes.join(' ');
    }

    get canClear() {
        return !isEmpty(this.args.select.searchText) && !this.args.select.disabled && this.args.select.allowClear;
    }

  /**
   * Lifecycle Hook
   * power-select updates the state of the publicAPI (select) for every typeahead
   * so we capture this as `state` via oldSelect && newSelect
   *
   * @private
   * @method didReceiveAttrs
   */

    get text() {
        // let oldSelect = this.oldSelect;
        // let newSelect = set(this, 'oldSelect', get(this, 'args.select'));
        // let input = document.querySelector(`#ember-power-select-infinity-input-${newSelect.uniqueId}`);
        // if (!oldSelect) {
        //     return;
        // }
        // /*
        // * We need to update the input field with value of the selected option whenever we're closing
        // * the select box.
        // */
        // if (oldSelect.isOpen && !newSelect.isOpen && newSelect.searchText) {
        //     let newText = this.selectedAsText;
        //     this._text = newText;
        // }

        // if(this.args.select.searchText && !this.args.select.selected) {
        //     this._text = this.args.select.searchText;
        // }

        // if (newSelect.lastSearchedText !== oldSelect.lastSearchedText) {
        //     if (isBlank(newSelect.lastSearchedText)) {
        //         run.schedule('actions', null, newSelect.actions.close, null, true);
        //     } else {
        //         run.schedule('actions', null, newSelect.actions.open);
        //     }
        // }

        // if (oldSelect.selected !== newSelect.selected) {
        //     this._text = this.selectedAsText;
        // }

        return this.args.select.selected ? this.selectedAsText : this.args.select.searchText;
    }

    /**
     * obtains selected value based on complex object or primitive value from power-select publicAPI
     *
     * @private
     * @method selectedAsText
     */
    get selectedAsText() {
        let labelPath = this.args.extra.labelPath;
        let selected = this.args.select.selected;
        let value = '';
        if (selected) {
            if (labelPath) {
                // complex object
                value = get(this, `args.select.selected.${labelPath}`);
            } else {
                // primitive value
                value = this.args.select.selected;
            }
        }
        return value;
    }

    /**
     * on mousedown prevent propagation of event
     *
     * @private
     * @method stopPropagation
     * @param {Object} event
     */
    @action
    stopPropagation(e: Event) {
        e.stopPropagation();
    }

    /**
     * called from power-select internals
     *
     * @private
     * @method handleKeydown
     * @param {Object} event
     */
    @action
    handleKeydown(e: KeyboardEvent): false | void {
        // up or down arrow and if not open, no-op and prevent parent handlers from being notified
        if ([KEYCODE_UP_ARROW, KEYCODE_DOWN_ARROW].indexOf(e.keyCode) > -1 && !this.args.select.isOpen) {
            e.stopPropagation();
        return;
        }
        let isLetter = e.keyCode >= KEYCODE_0 && e.keyCode <= KEYCODE_Z || e.keyCode === KEYCODE_SPACE; // Keys 0-9, a-z or SPACE
        // if isLetter, escape or enter, prevent parent handlers from being notified
        if (isLetter || [KEYCODE_ENTER, KEYCODE_ESCAPE].indexOf(e.keyCode) > -1) {
            let select = this.args.select;
            // open if loading msg configured
            if (!select.isOpen && this.args.loadingMessage) {
                run.schedule('actions', null, select.actions.open);
            }
            e.stopPropagation();
        }

        if (e.keyCode === KEYCODE_BACKSPACE && this.args.select.selected) {
            e.stopPropagation();
            if (this.args.select.selected) {
                this.args.select.actions.select(null);
            }
            run.schedule('actions', null, this.args.select.actions.search);
            run.schedule('actions', null, this.args.select.actions.open);
        }

        // optional, passed from power-select
        let onkeydown = this.args.onKeydown;
        if (onkeydown && onkeydown(e) === false) {
            return false;
        }
    }

    @action
    focusInput(el: HTMLElement) {
        later(() => {
            if (this.args.autofocus !== false) {
                el.focus();
            }
        }, 0);
    }

    @action
    clearSearch(e: Event) {
        e.stopPropagation();
        this.args.select.actions.select(null);
        if (e.type === 'touchstart') {
            return false;
        }
    }
}

export default setComponentTemplate(layout, PowerSelectInfinityTriggerComponent);
