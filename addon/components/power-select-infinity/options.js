import OptionsComponent from 'ember-power-select/components/power-select/options';
import layout from '../../templates/components/power-select-infinity/options';

export default OptionsComponent.extend({
  layout,
  actions: {
      onScroll() {
          this.select.actions.onScroll();
      }
  }
});
