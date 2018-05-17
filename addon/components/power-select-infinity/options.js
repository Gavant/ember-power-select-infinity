import OptionsComponent from 'ember-power-select/components/power-select/options';
import layout from '../../templates/components/power-select-infinity/options';
import { tryInvoke } from '@ember/utils';
import { get } from '@ember/object';

export default OptionsComponent.extend({
  layout,
  actions: {
      onScroll() {
          tryInvoke(this, 'onScroll', [get(this, 'select.searchText')]);
      }
  }
});
