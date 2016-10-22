import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './partiesList.html';
import { Parties } from '../../../api/parties';
import { name as PartyAdd } from '../partyAdd/partyAdd';
import { name as RemoveParty } from '../removeParty/removeParty';

class PartiesList {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.helpers({
      parties(){
        // eslint-disable-next-line
        return Parties.find({});
      }
    });
  }
}

const name = 'partiesList';

// Create the angular module
export default angular.module(name, [
  angularMeteor,
  PartyAdd,
  RemoveParty
]).component(name, {
  template,
  controllerAs: name,
  controller: PartiesList
});