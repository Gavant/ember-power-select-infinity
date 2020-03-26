import Component from '@ember/component';
import { get, action, computed } from '@ember/object';
import layout from '../templates/components/power-select-infinity';
import { scheduleOnce } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { getOwner } from '@ember/application';

export default class PowerSelectInfinityComponent extends Component {
    tagName = '';
    layout = layout;
    tabindex = -1;
    allowClear = true;
    triggerComponent = 'power-select-infinity/trigger';
    optionsComponent = 'power-select-infinity/options';
    loadingComponent = 'power-select-infinity/loading';
    beforeOptionsComponent = null;
    searchEnabled = false;
    loadingMessage = null;
    noMatchesMessage = null;
    estimateHeight = 28;
    bufferSize = 5;
    staticHeight = false;

    get fastboot() {
        return getOwner(this).lookup(`service:fastboot`);
    }

    // CPs
    @computed('triggerClass')
    get concatenatedTriggerClasses() {
        let classes = ['ember-power-select-infinity-trigger'];
        let passedClass = get(this, 'triggerClass');
        if (passedClass) {
            classes.push(passedClass);
        }
        return classes.join(' ');
    }

    @computed('dropdownClass')
    get concatenatedDropdownClasses() {
        let classes = ['ember-power-select-infinity-dropdown'];
        let passedClass = get(this, 'dropdownClass');
        if (passedClass) {
            classes.push(passedClass);
        }
        return classes.join(' ');
    }

    @action
    async handleFocus(select) {
        await select.actions.search();
        if (!isEmpty(select.options)) {
            scheduleOnce('actions', select, select.actions.open);
        }
    }

    @action
    onKeyDown(select, e) {
        let keyAction = get(this, 'onkeydown');

        // if user passes `onkeydown` action
        if (!keyAction || keyAction(select, e) !== false) {
            // if escape, then clear out selection
            if (e.keyCode === 27) {
                select.actions.choose(null);
            }
        }
    }
}
