import EmberLoadRemover from 'ember-load/components/ember-load-remover';

export default EmberLoadRemover.extend({
  removeLoadingIndicator() {
    this._super(...arguments);
  }
});