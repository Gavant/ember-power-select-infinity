import Component from '@ember/component';
import { computed } from '@ember/object';
import { tryInvoke } from '@ember/utils';
import layout from '../templates/components/power-select-infinity';
import { get, set } from '@ember/object';

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
      onKeyDown(select, e) {
          let action = this.get('onkeydown');

          // if user passes `onkeydown` action
          if (!action || action(select, e) !== false) {
            // if escape, then clear out selection
            if (e.keyCode === 27) {
              select.actions.choose(null);
            }
          }
      },
      loadMore(term) {
         return tryInvoke(this, 'loadMore', [term]).then(results => {
             let plainArray = results.toArray ? results.toArray() : results;
             return plainArray;
         });
      }
  }
});
