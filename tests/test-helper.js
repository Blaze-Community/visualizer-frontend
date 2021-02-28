import Application from 'ember-visualizer/app';
import config from 'ember-visualizer/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
