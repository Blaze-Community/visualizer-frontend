import RESTAdapter from "@ember-data/adapter/json-api";

export default class VisualizersAdapter extends RESTAdapter {
  host = "https://visualizer-backend-production.up.railway.app";
  namespace = "api";
}
