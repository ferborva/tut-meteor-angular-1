import angular from 'angular';
import angularMeteor from 'angular-meteor';
 
import template from './partyRsvpList.html';
import { name as PartyRsvpUsers } from '../partyRsvpUsers/partyRsvpUsers';
 
class PartyRsvpList {}
 
const name = 'partyRsvpList';
 
const comp = angular.module(name, [
  angularMeteor,
  PartyRsvpUsers
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