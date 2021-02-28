import attr from 'ember-data/attr';
import ModelBase from 'open-event-frontend/models/base';
import { hasMany,belongsTo } from 'ember-data/relationships';

export default ModelBase.extend({
  name: attr('string'),
  comments: hasMany('comment'),
  rateAvg: attr('number'),
  rateCount: attr('number'),
  hasRated: hasMany('user')
})
