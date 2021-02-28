import attr from 'ember-data/attr';
import ModelBase from 'open-event-frontend/models/base';
import { belongsTo } from 'ember-data/relationships';

export default ModelBase.extend({

  text: attr('string'),
  createdAt: { type: Date, default: Date.now },
  username: attr('string'),
  rating: attr('number'),

  /**
   * Relationships
   */
  author: belongsTo('user'),
});
