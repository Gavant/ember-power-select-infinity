import Component from '@ember/component';
import { get, computed } from '@ember/object';
import layout from '../templates/components/power-select-infinity';
import { scheduleOnce } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { getOwner } from '@ember/application';

export default Component.extend({
  tagName: '',
  layout,
  tabindex: -1,
  allowClear: true,
  triggerComponent: 'power-select-infinity/trigger',
  optionsComponent: 'power-select-infinity/options',
  loadingComponent: 'power-select-infinity/loading',
  beforeOptionsComponent: null,
  searchEnabled: false,
  loadingMessage: null,
  noMatchesMessage: null,
  estimateHeight: 28,
  bufferSize: 5,
  staticHeight: false,
  fastboot: computed(function() {
    return getOwner(this).lookup(`service:fastboot`);
  }),
  // CPs
  concatenatedTriggerClasses: computed('triggerClass', function() {
    let classes = ['ember-power-select-infinity-trigger'];
    let passedClass = get(this, 'triggerClass');
    if (passedClass) {
      classes.push(passedClass);
    }
    return classes.join(' ');
  }),

  concatenatedDropdownClasses: computed('dropdownClass', function() {
    let classes = ['ember-power-select-infinity-dropdown'];
    let passedClass = get(this, 'dropdownClass');
    if (passedClass) {
      classes.push(passedClass);
    }
    return classes.join(' ');
  }),

    actions: {
        async handleFocus(select) {
            await scheduleOnce('actions', select, select.actions.search);
            if (!isEmpty(select.options)) {
                scheduleOnce('actions', select, select.actions.open);
            }
        },
        onKeyDown(select, e) {
            let action = get(this, 'onkeydown');

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
