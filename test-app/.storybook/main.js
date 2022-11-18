const path = require('path');

module.exports = {
    stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx|gjs|gts)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
    framework: '@storybook/ember',
    core: {
        builder: 'webpack5'
    },
    webpackFinal: async (config, { configType }) => {
        // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
        // You can change the configuration based on that.
        // 'PRODUCTION' is used when building the static version of storybook.
        // config.resolve.extensions.push('.gjs');

        config.module.rules.push({
            test: /\.gjs$/,
            exclude: [/node_modules/],
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: [path.resolve(__dirname, '../../node_modules/ember-template-imports/src/babel-plugin.js')]
                }
            }
        });

        config.module.rules.push({
            exclude: [/node_modules/],
            test: /\.gjs$/,
            use: [path.resolve(__dirname, 'loader.js')]
        });

        config.resolve = {
            ...config.resolve,
            fallback: {
                ...config.resolve.fallback,
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify')
                // '@ember/component': false,
                // '@ember/template-compilation': false,
                // fs: false
            }
        };

        config.resolve.mainFields = ['browser', 'module', 'main'];

        return config;
    }
};
