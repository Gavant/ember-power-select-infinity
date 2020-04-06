import Component from '@ember/component';
import { get, set, action } from '@ember/object';
import { isBlank, isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
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

class PowerSelectInfinityTriggerComponent extends Component {
    tagName = '';
    @tracked text = '';

    get concatenatedInputClasses() {
        let classes = ['ember-power-select-infinity-input'];
        let passedClass = this.inputClass;
        if (passedClass) {
            classes.push(passedClass);
        }
        return classes.join(' ');
    }

    get canClear() {
        return !isEmpty(this.args.select.searchText) && !this.args.select.disabled && this.args.allowClear;
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
        let oldSelect = this.oldSelect;
        let newSelect = set(this, 'oldSelect', get(this, 'select'));
        if (!oldSelect) {
            return;
        }
        /*
        * We need to update the input field with value of the selected option whenever we're closing
        * the select box.
        */
        if (oldSelect.isOpen && !newSelect.isOpen && newSelect.searchText) {
            let input = document.querySelector(`#ember-power-select-infinity-input-${newSelect.uniqueId}`);
            let newText = this.selectedAsText;
            if (input.value !== newText) {
                input.value = newText;
            }
            return newText;
        }

        if (newSelect.lastSearchedText !== oldSelect.lastSearchedText) {
        if (isBlank(newSelect.lastSearchedText)) {
            run.schedule('actions', null, newSelect.actions.close, null, true);
        } else {
            run.schedule('actions', null, newSelect.actions.open);
        }
        }

        if (oldSelect.selected !== newSelect.selected) {
            return this.selectedAsText;
        }
    }

    /**
     * obtains selected value based on complex object or primitive value from power-select publicAPI
     *
     * @private
     * @method selectedAsText
     */
    get selectedAsText() {
        let labelPath = this.extra.labelPath;
        let selected = this.select.selected;
        let value = null;
        if (selected) {
            if (labelPath) {
                // complex object
                value = get(this, `select.selected.${labelPath}`);
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
    stopPropagation(e) {
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
    handleKeydown(e) {
        // up or down arrow and if not open, no-op and prevent parent handlers from being notified
        if ([KEYCODE_UP_ARROW, KEYCODE_DOWN_ARROW].indexOf(e.keyCode) > -1 && !get(this, 'select.isOpen')) {
            e.stopPropagation();
        return;
        }
        let isLetter = e.keyCode >= KEYCODE_0 && e.keyCode <= KEYCODE_Z || e.keyCode === KEYCODE_SPACE; // Keys 0-9, a-z or SPACE
        // if isLetter, escape or enter, prevent parent handlers from being notified
        if (isLetter || [KEYCODE_ENTER, KEYCODE_ESCAPE].indexOf(e.keyCode) > -1) {
            let select = get(this, 'select');
            // open if loading msg configured
            if (!select.isOpen && get(this, 'loadingMessage')) {
                run.schedule('actions', null, select.actions.open);
            }
            e.stopPropagation();
        }

        if (e.keyCode === KEYCODE_BACKSPACE && get(this, 'select.selected')) {
            let select = get(this, 'select');
            e.stopPropagation();
            if (get(this, 'select.selected')) {
                select.actions.select(null);
            }
            run.schedule('actions', null, select.actions.search);
            run.schedule('actions', null, select.actions.open);
        }

        // optional, passed from power-select
        let onkeydown = get(this, 'onKeydown');
        if (onkeydown && onkeydown(e) === false) {
            return false;
        }
    }

    @action
    clear(e) {
        e.stopPropagation();
        this.select.actions.select(null);
        if (e.type === 'touchstart') {
            return false;
        }
    }
}

export default setComponentTemplate(layout, PowerSelectInfinityTriggerComponent);
