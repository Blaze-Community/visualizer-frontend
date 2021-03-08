import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {

  @service session;

  beforeModel() {
     if(this.session.isAuthenticated)
	{ 
          this.store.push({
	     data: [{
		id: this.session.data.authenticated.user._id,
		type: 'user',
		attributes: {
		  userName: this.session.data.authenticated.user.userName,
		  email: this.session.data.authenticated.user.email,
		  password: this.session.data.authenticated.user.password
		}
	      }]
             });
        }

  }

}
