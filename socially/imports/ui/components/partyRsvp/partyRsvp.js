import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { findWhere } from 'underscore';

import { Meteor } from 'meteor/meteor';

import template from './partyRsvp.html';

class PartyRsvp {
  yes() {
    this.answer('yes');
  }

  isYes() {
    return this.isAnswer('yes')
  }

  maybe() {
    this.answer('maybe');
  }

  isMaybe() {
    return this.isAnswer('maybe');
  }

  no() {
    this.answer('no');
  }

  isNo() {
    return this.isAnswer('no');
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

  isAnswer(answer) {
    if (this.party) {
      return !!findWhere(this.party.rsvps, {
        user: Meteor.userId(),
        rsvp: answer
      });
    }
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