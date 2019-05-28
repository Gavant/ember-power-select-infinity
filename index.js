'use strict';

module.exports = {
    name: '@gavant/ember-power-select-infinity',
    contentFor: function(type, config) {
        var emberPowerSelect = this.addons.filter(function(addon) {
            return addon.name === 'ember-power-select';
        })[0]
        return emberPowerSelect.contentFor(type, config);
    },
    included: function(/* app */) {
        this._super.included.apply(this, arguments);
    }
};
