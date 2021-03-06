import Visualizers from './visualizers';
import { inject as service } from '@ember/service';

export default Visualizers.extend( {
  @service session,

  pathForType(){
    return "comment";
  },


  @computed('session.data.authenticated.token')
  get headers() {
    let headers = {};
    if (this.session.isAuthenticated) {
      headers['token'] = this.session.data.authenticated.token;
    }
    return headers;
  }

});
