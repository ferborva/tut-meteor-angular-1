import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './removeParty.html';
import { Parties } from '../../../api/parties';

class RemoveParty {
  remove() {
    if (this.party) {
      // eslint-disable-next-line
      Parties.remove(this.party._id);
    }
  }
}

const name = 'removeParty';

export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  bindings: {
    party: '<'
  },
  controllerAs: name,
  controller: RemoveParty
});