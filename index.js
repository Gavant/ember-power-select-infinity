'use strict';

module.exports = {
    name: require('./package').name,
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
