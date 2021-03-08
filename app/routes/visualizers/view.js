import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class VisualizersViewRoute extends Route {
  @service session;

  async model(params){
     const allRecord= await this.store.queryRecord('algorithm',{name:params.name});
     console.log(allRecord);
     return allRecord;
  }

}
