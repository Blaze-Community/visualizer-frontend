import EmberRouter from '@ember/routing/router';
import config from 'ember-visualizer/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('visualizers',{path: '/Visualizers'},function() {
    this.route('view',{path: '/:name'});
  });
  this.route('about');
  this.route('not-found',{path: '/*path'});
  this.route('login');
  this.route('signup');
});
