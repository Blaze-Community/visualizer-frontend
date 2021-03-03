import attr from 'ember-data/attr';
import { hasMany,belongsTo } from 'ember-data/relationships';
import DS from 'ember-data';

export default DS.Model.extend({

  name: attr('string'),
  comments: hasMany('comment')
})
