import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import template from './partyDetails.html';

class PartyDetails {
  constructor($stateParams){
    'ngInject';

    this.partyId = $stateParams.partyId;
  }
}

const name = 'partyDetails';

const partyDetailsComp = angular.module(name, [
  angularMeteor,
  uiRouter
]);

partyDetailsComp.component(name, {
  template,
  controllerAs: name,
  controller: PartyDetails
});

partyDetailsComp.config(config);

function config($stateProvider){
  'ngInject';

  $stateProvider.state('partyDetails', {
    url: '/parties/:partyId',
    template: '<party-details></party-details>'
  })
}

export default partyDetailsComp;