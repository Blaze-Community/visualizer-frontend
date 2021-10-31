import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';

export default Base.extend({
  flashMessages: service(),

  async restore(data) {
   console.log(data);
   let {token} = data;
   if(token){
    return data;}
   else
    {throw 'no valid session data';}
  },

  async authenticate(email,password) {
   let response = await fetch('https://api-ds-visualizers.herokuapp.com/api/signin',{
    method:'POST',
    headers:{
       'Content-Type': 'application/json'
     },
    body: JSON.stringify({
      user:{email,password}
      })
    });
   if(response.ok)	
     {   
        let res = await response.json();
        this.flashMessages.add({
            message           : "Login Successfully!",
            type              : "success",
           preventDuplicates : true
        });
        return res;
      }
   else
    { 
      let res = await response.json();
      this.flashMessages.add({
          message           : res.error,
          type              : "danger",
         preventDuplicates : true
      });
      throw new Error(res.error)
    }
  },

  async invalidate(data) {

  }

});
