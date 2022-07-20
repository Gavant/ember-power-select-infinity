import config from './config/environment';
import EmberRouter from '@ember/routing/router';

export default class Router extends EmberRouter {
    location = config.locationType;
    rootURL = config.rootURL;
}

Router.map(function () {
    this.route('index', { path: '/' });
    this.route('not-found', { path: '/*path' });
});
