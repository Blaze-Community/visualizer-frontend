import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin ,{
  primaryKey:"_id",
  attrs: {
    comments: { embedded: 'always' },
  },
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
   console.log(payload);
   return this._super(store, primaryModelClass, payload, id, requestType) 
  }
});
