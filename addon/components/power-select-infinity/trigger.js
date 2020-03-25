import Component from '@ember/component';
import { get, computed, action } from '@ember/object';
import { isBlank, isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import layout from '../../templates/components/power-select-infinity/trigger';

const KEYCODE_BACKSPACE = 8;
const KEYCODE_UP_ARROW = 38;
const KEYCODE_DOWN_ARROW = 40;
const KEYCODE_0 = 48;
const KEYCODE_Z = 90;
const KEYCODE_SPACE = 32;
const KEYCODE_ENTER = 13;
const KEYCODE_ESCAPE = 27;

export default class TriggerComponent extends Component {
    layout;
    tagName = '';
    text = '';
    inputClass;
    text;
    allowClear;

    get concatenatedInputClasses() {
        let classes = ['ember-power-select-infinity-input'];
        let passedClass = get(this, 'inputClass');
        if (passedClass) {
        classes.push(passedClass);
        }
        return classes.join(' ');
    }

    @computed('select.disabled')
    get canClear() {
        return !isEmpty(get(this, 'text')) && !get(this, 'select.disabled') && get(this, 'allowClear');
    }


  /**
   * Lifecycle Hook
   * power-select updates the state of the publicAPI (select) for every type ahead
   * so we capture this as `state` via oldSelect && newSelect
   *
   * @private
   * @method didReceiveAttrs
   */
    get didReceiveAttrs() {
        super.didReceiveAttrs(...arguments);
        let oldSelect = get(this, 'oldSelect');
        oldSelect = get(this, 'select');
        let newSelect = oldSelect;
        if (!oldSelect) {
            return;
        }
        /*
        * We need to update the input field with value of the selected option whenever we're closing
        * the select box.
        */
        if (oldSelect.isOpen && !newSelect.isOpen && newSelect.searchText) {
            let input = document.querySelector(`#ember-power-select-infinity-input-${newSelect.uniqueId}`);
            let newText = this.getSelectedAsText();
            if (input.value !== newText) {
                input.value = newText;
            }
            this.text = newText;
        }

        if (newSelect.lastSearchedText !== oldSelect.lastSearchedText) {
            if (isBlank(newSelect.lastSearchedText)) {
                run.schedule('actions', null, newSelect.actions.close, null, true);
            } else {
                run.schedule('actions', null, newSelect.actions.open);
            }
        }

        if (oldSelect.selected !== newSelect.selected) {
            this.text = this.getSelectedAsText();
        }
    }

    /**
     * obtains seleted value based on complex object or primitive value from power-select publicAPI
     *
     * @private
     * @method getSelectedAsText
     */
    get getSelectedAsText() {
        let labelPath = get(this, 'extra.labelPath');
        let selected = get(this, 'select.selected');
        let value = null;
        if (selected) {
            if (labelPath) {
            // complex object
            value = get(this, `select.selected.${labelPath}`);
            } else {
            // primitive value
            value = get(this, 'select.selected');
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
        this.get('select').actions.select(null);
        if (e.type === 'touchstart') {
            return false;
        }
    }
}
