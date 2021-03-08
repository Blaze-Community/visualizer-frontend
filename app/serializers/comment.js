import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin ,{
  primaryKey:"_id",

  attrs: {
    userId: { embedded: 'always' },
  },
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
   payload = {comments:{
     userId:payload.userId
   }}
   console.log("comment payload",payload);
   return this._super(store, primaryModelClass, payload, id, requestType) 
  }

});
