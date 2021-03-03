import Route from '@ember/routing/route';

export default class VisualizersViewRoute extends Route {

  model(params){
     const allRecord= this.store.queryRecord('algorithm',{name:params.name});
     console.log(allRecord);
     return allRecord;
  }

}
