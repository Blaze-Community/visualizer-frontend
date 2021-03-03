import attr from 'ember-data/attr';
import DS from 'ember-data';

export default DS.Model.extend({


  /**
   * Attributes
   */

  userName : attr('string'),
  email    : attr('string'),
  password : attr('string'),

});

