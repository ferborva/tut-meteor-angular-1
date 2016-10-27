import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './partiesList.html';
import { Parties } from '../../../api/parties';
import { name as PartyAdd } from '../partyAdd/partyAdd';
import { name as RemoveParty } from '../removeParty/removeParty';

class PartiesList {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('parties');

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
const partiesListComp = angular.module(name, [
  angularMeteor,
  uiRouter,
  PartyAdd,
  RemoveParty
]);

partiesListComp.component(name, {
  template,
  controllerAs: name,
  controller: PartiesList
});

partiesListComp.config(config);

function config($stateProvider){
  'ngInject';

  $stateProvider.state('parties', {
    url: '/parties',
    template: '<parties-list></parties-list>'
  });
}

export default partiesListComp;