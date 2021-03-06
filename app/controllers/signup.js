import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class SignupController extends Controller {
    @tracked userName;
    @tracked email;
    @tracked password;


    @action
    async signup(event){
        event.preventDefault();
        console.log(this.userName,this.password);
        let post = this.store.createRecord('user', {
            userName : this.userName,
            email: this.email,
            password: this.password,
        });
        post.save();
    }
    
    @action
    update(attr,event){
    this[attr] = event.target.value;
    }
}
