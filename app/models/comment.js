import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import DS from 'ember-data';

export default DS.Model.extend({

  commentBody: attr('string'),
  isEdited: attr('boolean'),

  /**
   * Relationships
   */
  userId: belongsTo('user',{ async: false }),
});
