const path = require('path');
const fs = require('fs');
// const fs = require('fs');
// var nodeModules = {};
// fs.readdirSync(path.resolve(__dirname, 'node_modules'))
//     .filter((x) => ['.bin'].indexOf(x) === -1)
//     .forEach((mod) => {
//         nodeModules[mod] = `commonjs ${mod}`;
//     });
module.exports = {
    emberOptions: {
        polyfills: [path.resolve(__dirname, '../../node_modules/ember-template-imports/src/babel-plugin.js')]
    },
    stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx|gjs|gts)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
    framework: '@storybook/ember',
    core: {
        builder: 'webpack5'
    },
    babel: async (options) => ({
        ...options
        // any extra options you want to set
    }),
    webpackFinal: async (config, { configType }) => {
        // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
        // You can change the configuration based on that.
        // 'PRODUCTION' is used when building the static version of storybook.
        // config.resolve.extensions.push('.gjs');

        config.module.rules.push({
            test: /\.gjs$/,
            use: {
                loader: 'babel-loader',
                options: {
                    plugins: [path.resolve(__dirname, '../../node_modules/ember-template-imports/src/babel-plugin.js')]
                }
            }
        });

        config.module.rules.push({
            test: /\.gjs$/,
            use: [path.resolve(__dirname, 'loader.js')]
        });

        config.resolve = {
            ...config.resolve,
            modules: ['node_modules', path.resolve(__dirname, '../../node_modules')],
            fallback: {
                ...config.resolve.fallback,
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                os: require.resolve('os-browserify/browser'),
                // '@ember/component': false,
                // '@ember/template-compilation': false,
                fs: false,
                tls: false,
                net: false,
                path: false,
                zlib: false,
                http: false,
                https: false,
                stream: false,
                crypto: false,
                assert: false,
                child_process: false,
                constants: false
            }
            // extensions: ['.ts', '.js'],
            // mainFields: ['module', 'main'],
        };

        config.target = 'web';
        // config.externals = nodeModules;

        return config;
    }
};
