import Visualizers from './visualizers';
import { inject as service } from '@ember/service';


export default Visualizers.extend( {
flashMessages: service(),

    pathForType(){
        return "signup";
    },

  handleResponse(status, headers, payload) {  
  console.log(status, headers, payload);                                                                                                                                                                                             
   if(status === 200){
      this.flashMessages.add({
            message           : payload.message,
            type              : "success",
           preventDuplicates : true
        });
    }
   else{
           this.flashMessages.add({
            message           : payload.error,
            type              : "danger",
           preventDuplicates : true
        });
   }                                                                                                                                                                                                                         
    return this._super(...arguments);                                                                                                                                                                                                                                                                                                                                                                                                                        
  }
});
