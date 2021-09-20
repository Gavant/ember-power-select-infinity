import Trigger from 'ember-power-select/components/power-select-multiple/trigger';
import { Select } from 'ember-power-select/addon/components/power-select';
import { action } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default class PowerSelectInfinityTriggerSearch extends Trigger {
    /**
     * Clears the search bar on blur.
     *
     */
    @action
    onBlur() {
        scheduleOnce('actions', this.args.select.actions, 'search', '');
        this.args.onBlur?.();
    }

    /**
     * Clears results and search text on clear.
     *
     * @param {Select} select
     */
    @action
    onClear(select: Select) {
        select.actions.select(null);
        this.args.extra.clearSearch?.();
        this.args.extra.clearOptions?.();
        scheduleOnce('afterRender', this, 'focusTrigger');
    }

    /**
     * `handleKeydown` isn't an action in the original component
     * and is invoked from the template through this action.
     *
     * @param {KeyboardEvent} e
     */
    @action
    handleKeydown(e: KeyboardEvent) {
        super.handleKeydown(e);
    }

    /**
     * Allow items/results to be cleared before sending
     * the `Select` to be "opened" so the dropdown
     * isn't opened with empty results.
     *
     */
    @action
    async focusTrigger() {
        await new Promise((r) => setTimeout(r, 300));
        this.args.select.actions.open();
    }
}
