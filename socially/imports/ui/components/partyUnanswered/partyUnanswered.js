import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { findWhere } from 'underscore';
 
import { Meteor } from 'meteor/meteor';
 
import template from './partyUnanswered.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
 
class PartyUnanswered {
  getUnanswered() {
    if (!this.party || !this.party.invited) {
      return;
    }
 
    return this.party.invited.filter((user) => {
      return !findWhere(this.party.rsvps, { user });
    });
  }
 
  getUserById(userId) {
    return Meteor.users.findOne(userId)
  }
}
 
const name = 'partyUnanswered';
 
const comp = angular.module(name, [
  angularMeteor,
  DisplayNameFilter
]);

comp.component(name, {
  template,
  controllerAs: name,
  bindings: {
    party: '<'
  },
  controller: PartyUnanswered
});

export default comp;