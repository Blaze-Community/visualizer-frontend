import RESTAdapter from '@ember-data/adapter/json-api';

export default class VisualizersAdapter extends RESTAdapter {

  host= "https://api-ds-visualizers.herokuapp.com";
  namespace= "api"
}
