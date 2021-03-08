import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({

  commentBody: attr('string'),
  isEdited: attr('boolean'),
  algoId:   attr('string'),
  createdAt : attr('string'),

  /**
   * Relationships
   */
  userId: belongsTo('user',{ async: false }),
});
