import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class VisualizersViewController extends Controller {
  @service session;
  @service flashMessages;

  @action
  async submit (){
    if(!this.session.isAuthenticated)
      { 
        this.flashMessages.add({
          message           : 'Please login to comment. If you have not registered yet, please create an account first. Thank you!',
          type              : "danger",
          preventDuplicates : true
        });
      }
    else
    {  
      let newComment = this.store.createRecord('comment', {
        commentBody: this.newComment,
        algoId: this.model.id,
        userId: this.store.peekRecord('user',this.session.data.authenticated.user._id)
      });
      await newComment.save().then(() =>{
                 window.location.reload(true);
         })
    }
  }

  @action
  update (commentId){
    const oldRecord = this.store.peekRecord('comment',commentId);
    oldRecord.commentBody = this.editComment;
    oldRecord.save().then(() =>{
                 window.location.reload(true);
         });
  }
  
  @action
  delete (commentId){
   const comment = this.store.peekRecord('comment',commentId);
   comment.destroyRecord({ adapterOptions: {
      data: {
        algoId: this.model.id
      }
    }})
  }

  @action
  updateValue(attr,event){
    this[attr] = event.target.value;
  }
}
