import RESTAdapter from '@ember-data/adapter/json-api';

export default class VisualizersAdapter extends RESTAdapter {

  host= "http://localhost:5000";
  namespace= "api"
}
