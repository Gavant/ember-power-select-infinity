import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from './config/environment';

const Router = AddonDocsRouter.extend({
    location: config.locationType,
    rootURL: config.rootURL
});

Router.map(function () {
    docsRoute(this, function () {
        this.route('usage', { path: '/' });
        this.route('components', function () {
            this.route('power-select-infinity');
            this.route('power-select-infinity-for-model');
            this.route('power-select-infinity-trigger-with-load');
        });
    });
    this.route('not-found', { path: '/*path' });
});

export default Router;
