import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { isBlank, isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import layout from '../../templates/components/power-select-infinity/trigger';

export default Component.extend({
  layout,
  tagName: '',
  text: '',

  concatenatedInputClasses: computed('inputClass', function() {
    let classes = ['ember-power-select-infinity-input'];
    let passedClass = get(this, 'inputClass');
    if (passedClass) {
      classes.push(passedClass);
    }
    return classes.join(' ');
  }),

  canClear: computed('select.{disabled}', 'text', 'allowClear', function() {
    return !isEmpty(get(this, 'text')) && !get(this, 'select.disabled') && get(this, 'allowClear');
  }),


  /**
   * Lifecycle Hook
   * power-select updates the state of the publicAPI (select) for every typeahead
   * so we capture this as `state` via oldSelect && newSelect
   *
   * @private
   * @method didReceiveAttrs
   */
  didReceiveAttrs() {
    this._super(...arguments);
    let oldSelect = get(this, 'oldSelect');
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
      let newText = this.getSelectedAsText();
      if (input.value !== newText) {
        input.value = newText;
      }
      set(this, 'text', newText);
    }

    if (newSelect.lastSearchedText !== oldSelect.lastSearchedText) {
      if (isBlank(newSelect.lastSearchedText)) {
        run.schedule('actions', null, newSelect.actions.close, null, true);
      } else {
        run.schedule('actions', null, newSelect.actions.open);
      }
    }

    if (oldSelect.selected !== newSelect.selected) {
      set(this, 'text', this.getSelectedAsText());
    }
  },

  actions: {
    /**
     * on mousedown prevent propagation of event
     *
     * @private
     * @method stopPropagation
     * @param {Object} event
     */
    stopPropagation(e) {
      e.stopPropagation();
    },

    /**
     * called from power-select internals
     *
     * @private
     * @method handleKeydown
     * @param {Object} event
     */
    handleKeydown(e) {
      // up or down arrow and if not open, no-op and prevent parent handlers from being notified
      if ([38, 40].indexOf(e.keyCode) > -1 && !get(this, 'select.isOpen')) {
        e.stopPropagation();
        return;
      }
      let isLetter = e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32; // Keys 0-9, a-z or SPACE
      // if isLetter, escape or enter, prevent parent handlers from being notified
      if (isLetter || [13, 27].indexOf(e.keyCode) > -1) {
        let select = get(this, 'select');
        // open if loading msg configured
        if (!select.isOpen && get(this, 'loadingMessage')) {
          run.schedule('actions', null, select.actions.open);
        }
        e.stopPropagation();
      }

      if (e.keyCode === 8 && get(this, 'select.selected')) {
          let select = get(this, 'select');
          e.stopPropagation();
          select.actions.select(null);
          run.schedule('actions', null, select.actions.open);
      } else if (e.keyCode === 8 && get(this, 'select.searchText') <= 1) {
          let select = get(this, 'select');
          run.schedule('actions', null, select.actions.open);
      }

      // optional, passed from power-select
      let onkeydown = get(this, 'onKeydown');
      if (onkeydown && onkeydown(e) === false) {
        return false;
      }
  },
    clear(e) {
      e.stopPropagation();
      this.get('select').actions.select(null);
      if (e.type === 'touchstart') {
        return false;
      }
    }
  },

  /**
   * obtains seleted value based on complex object or primitive value from power-select publicAPI
   *
   * @private
   * @method getSelectedAsText
   */
  getSelectedAsText() {
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
  },
});
