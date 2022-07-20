'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

const packageJson = require('./package');
module.exports = function (defaults) {
    let app = new EmberApp(defaults, {
        autoImport: {
            watchDependencies: Object.keys(packageJson.dependencies)
        },
        sassOptions: {
            includePaths: ['../node_modules/@gavant/ember-power-select-infinity/dist/styles']
        }
    });

    const { Webpack } = require('@embroider/webpack');
    return require('@embroider/compat').compatBuild(app, Webpack, {
        packageRules: [
            {
                package: 'ember-power-select',
                addonModules: {
                    './components/power-select.js': {
                        dependsOnComponents: [
                            '{{power-select/before-options}}',
                            '{{power-select/options}}',
                            '{{power-select/power-select-group}}',
                            '{{power-select/trigger}}',
                            '{{power-select/search-message}}',
                            '{{power-select/placeholder}}'
                        ]
                    },
                    './components/power-select-multiple.js': {
                        dependsOnComponents: ['{{power-select-multiple/trigger}}']
                    }
                },
                components: {
                    '{{power-select}}': {
                        layout: {
                            addonPath: 'templates/components/power-select.hbs'
                        },
                        acceptsComponentArguments: [
                            'afterOptionsComponent',
                            'beforeOptionsComponent',
                            'optionsComponent',
                            'placeholderComponent',
                            'searchMessageComponent',
                            'selectedItemComponent',
                            'triggerComponent'
                        ]
                    },
                    '{{power-select-multiple}}': {
                        layout: {
                            addonPath: 'templates/components/power-select-multiple.hbs'
                        },
                        acceptsComponentArguments: [
                            'afterOptionsComponent',
                            'beforeOptionsComponent',
                            'groupComponent',
                            'optionsComponent',
                            'placeholderComponent',
                            'searchMessageComponent',
                            'selectedItemComponent',
                            'triggerComponent'
                        ]
                    },
                    '{{power-select/trigger}}': {
                        layout: {
                            addonPath: 'templates/components/power-select/trigger.hbs'
                        },
                        acceptsComponentArguments: ['selectedItemComponent', 'placeholderComponent']
                    },
                    '{{power-select/options}}': {
                        layout: {
                            addonPath: 'templates/components/power-select/options.hbs'
                        },
                        acceptsComponentArguments: ['groupComponent', 'optionsComponent']
                    },
                    '{{power-select-multiple/trigger}}': {
                        layout: {
                            addonPath: 'templates/components/power-select-multiple/trigger.hbs'
                        },
                        acceptsComponentArguments: ['selectedItemComponent']
                    }
                }
            }
        ]
    });
};
