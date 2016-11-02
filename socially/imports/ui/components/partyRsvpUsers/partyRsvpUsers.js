import angular from 'angular';
import angularMeteor from 'angular-meteor';
 
import { Meteor } from 'meteor/meteor';
 
import template from './partyRsvpUsers.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
 
class PartyRsvpUsers {
  getUserById(userId) {
    return Meteor.users.findOne(userId);
  }
}
 
const name = 'partyRsvpUsers';
 
const comp = angular.module(name, [
  angularMeteor,
  DisplayNameFilter
]);

comp.component(name, {
  template,
  controllerAs: name,
  bindings: {
    rsvps: '<',
    type: '@'
  },
  controller: PartyRsvpUsers
});

export default comp;