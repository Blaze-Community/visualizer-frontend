import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
  async restore(data) {
   let {token} =data;
   if(token){
    return data;}
   else
    {throw 'no valid session data';}
  },

  async authenticate(email,password) {
   let response = await fetch('http://localhost:5000/api/signin',{
    method:'POST',
    headers:{
       'Content-Type': 'application/json'
     },
    body: JSON.stringify({
      user:{email,password}
      })
    });
    
   if(response.ok)	
     {return response.json;}
   else
    { let error = await response.text();
      throw new Error(error)
    }
  },

  async invalidate(data) {
  }

});
