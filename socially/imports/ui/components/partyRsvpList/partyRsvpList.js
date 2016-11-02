import angular from 'angular';
import angularMeteor from 'angular-meteor';
 
import template from './partyRsvpList.html';
 
class PartyRsvpList {}
 
const name = 'partyRsvpList';
 
const comp = angular.module(name, [
  angularMeteor
]);

comp.component(name, {
  template,
  controllerAs: name,
  bindings: {
    rsvps: '<'
  },
  controller: PartyRsvpList
});

export default comp;