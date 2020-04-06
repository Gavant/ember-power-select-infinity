import Component from '@ember/component';
import layout from '../../templates/power-select/loading';
import { setComponentTemplate } from '@ember/component';

class PowerSelectInfinityLoadingComponent extends Component {
  classNames = ['ember-power-select-infinity-loading-indicator'];
}

export default setComponentTemplate(layout, PowerSelectInfinityLoadingComponent);
