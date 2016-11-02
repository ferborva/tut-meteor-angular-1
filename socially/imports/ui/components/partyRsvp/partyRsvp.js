import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './partyRsvp.html';

class PartyRsvp {
  yes() {
    this.answer('yes');
  }

  maybe() {
    this.answer('maybe');
  }

  no() {
    this.answer('no');
  }

  answer(answer) {
    Meteor.call('rsvp', this.party._id, answer, (error) => {
      if (error) {
        console.log(`Could not perform the transaction. Error Code: ${error.error}`);
      } else {
        console.log('RSVP Sent!');
      }
    });
  }
}

const name = 'partyRsvp';

const comp = angular.module(name, [
  angularMeteor
]);

comp.component(name, {
  template,
  bindings: {
    party: '<'
  },
  controllerAs: name,
  controller: PartyRsvp
});

export default comp;