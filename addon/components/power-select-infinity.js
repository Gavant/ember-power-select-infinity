import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../templates/components/power-select-infinity';
import { scheduleOnce } from '@ember/runloop';

export default Component.extend({
  tagName: '',
  layout,
  tabindex: -1,
  triggerComponent: 'power-select-infinity/trigger',
  optionsComponent: 'power-select-infinity/options',
  beforeOptionsComponent: null,
  searchEnabled: false,
  loadingMessage: null,
  noMatchesMessage: null,

  // CPs
  concatenatedTriggerClasses: computed('triggerClass', function() {
    let classes = ['ember-power-select-typeahead-trigger'];
    let passedClass = this.get('triggerClass');
    if (passedClass) {
      classes.push(passedClass);
    }
    return classes.join(' ');
  }),

  concatenatedDropdownClasses: computed('dropdownClass', function() {
    let classes = ['ember-power-select-typeahead-dropdown'];
    let passedClass = this.get('dropdownClass');
    if (passedClass) {
      classes.push(passedClass);
    }
    return classes.join(' ');
  }),

  actions: {
      handleFocus(select) {
          scheduleOnce('actions', select, select.actions.search);
          scheduleOnce('actions', select, select.actions.open);
      },
      onKeyDown(select, e) {
          let action = this.get('onkeydown');

          // if user passes `onkeydown` action
          if (!action || action(select, e) !== false) {
            // if escape, then clear out selection
            if (e.keyCode === 27) {
              select.actions.choose(null);
            }
          }
      }
  }
});
