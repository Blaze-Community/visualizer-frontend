import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class VisualizersViewController extends Controller {
@service session;

  @action
  submit (){
    let newComment = this.store.createRecord('comment', {
       commentBody: this.newComment,
       algoId: this.model.id,
       userId: this.store.peekRecord('user',this.session.data.authenticated.user._id)
     });
     newComment.save(); // 
  }

  @action
  update (commentId){
    const oldRecord = this.store.peekRecord('comment',commentId);
    oldRecord.commentBody = this.editComment;
    oldRecord.save();
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
