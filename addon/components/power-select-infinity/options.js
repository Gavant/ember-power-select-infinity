import OptionsComponent from 'ember-power-select/components/power-select/options';
import layout from '../../templates/components/power-select-infinity/options';
import { tryInvoke } from '@ember/utils';
import { get } from '@ember/object';

export default OptionsComponent.extend({
  layout,
  didInsertElement() {
      this._super(...arguments);
      this.element.addEventListener('scroll', () => {
          if(this.element.scrollHeight - this.element.scrollTop == this.element.clientHeight) {
              tryInvoke(this, 'onScroll', [get(this, 'select.searchText'), get(this, 'select')]).then(newResults => {
                  newResults.forEach(result => {
                       // get(this, 'select.results').push(result);
                       // get(this, 'select._rawSearchResults').push(result);
                       get(this, 'options').push(result);
                  });
              })
          }
      });
  },
  actions: {
      onScroll() {
          tryInvoke(this, 'onScroll', [get(this, 'select.searchText'), get(this, 'select')]).then(newResults => {
              newResults.forEach(result => {
                   // get(this, 'select.results').push(result);
                   get(this, 'options').push(result);
              });
          })
      }
  }
});
