import Helper from '@ember/component/helper';

export function algoName(params/*, hash*/) {

  const str = params[0].replace(/\s+/g, '-').toLowerCase();
  return str;
}

export default Helper.helper(algoName);
