import attr from 'ember-data/attr';
import ModelBase from 'open-event-frontend/models/base';

export default ModelBase.extend({

  /**
   * Attributes
   */

  username : attr('string'),
  email    : attr('string'),
  password : attr('string'),

});

