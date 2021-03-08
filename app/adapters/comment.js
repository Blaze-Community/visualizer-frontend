import Visualizers from './visualizers';
import { inject as service } from '@ember/service';

export default Visualizers.extend( {
  session: service(),

  pathForType(){
    return "comment";
  },

  get headers() {
    let headers = {};
    if (this.session.isAuthenticated) {
      headers['authorization'] = 'Bearer ' + this.session.data.authenticated.token;
    }
    return headers;
  },

  urlForDeleteRecord(id, modelName, { adapterOptions: { data } }) {
    let queryString = data
      ? '?' + Object.keys(data).map(prop => `${prop}=${data[prop]}`).join('&')
      : '';

    return this._super(...arguments) + queryString;
  }

});
