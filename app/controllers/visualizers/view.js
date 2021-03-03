import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class VisualizersViewController extends Controller {

  @action
  submit (){
    console.log(this.newComment,this.model.id);
    let post = this.store.createRecord('comment', {
       commentBody: this.newComment,
       algoId: this.model.id,
       userId: "603ddf25d14aee0f666e632f"
     });

     post.save(); // 
  }
}
