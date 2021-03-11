import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import decode from 'jwt-decode';

export default class ApplicationRoute extends Route {

  @service session;

  beforeModel() {
     if(this.session.isAuthenticated)
	{ const token = decode(this.session.data.authenticated.token);
          if (!token.exp) { return null; }
          const expiredate = new Date(0);
          expiredate.setUTCSeconds(token.exp);
          console.log(expiredate, new Date());
          if(expiredate < new Date()){
            this.session.invalidate();
          }
          else{
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

}
