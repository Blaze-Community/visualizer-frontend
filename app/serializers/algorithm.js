import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin ,{
  primaryKey:"_id",
  attrs: {
    comments: { embedded: 'always' },
  },
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
   payload.algorithm.forEach(function(algo){
     algo.comments.forEach(function(comment){
       comment.algoId = algo._id;
     })
   })
   console.log(payload);
   return this._super(store, primaryModelClass, payload, id, requestType) 
  }
});
