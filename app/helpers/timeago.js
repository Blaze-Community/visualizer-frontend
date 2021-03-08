import Helper from '@ember/component/helper';

import moment from 'moment';

export function timeago(params/*, hash*/) {
  console.log(params);

  const ago = moment(params[0]).fromNow();
  return ago;
}

export default Helper.helper(timeago);
