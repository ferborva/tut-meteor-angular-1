import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';

import template from './partyDetails.html';
import { Parties } from '../../../api/parties';
import { name as PartyUninvited } from '../partyUninvited/partyUninvited';
import { name as PartyCreator } from '../partyCreator/partyCreator';
import { name as PartyMap } from '../partyMap/partyMap';

class PartyDetails {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.partyId = $stateParams.partyId;

    this.subscribe('parties');
    this.subscribe('users');

    this.helpers({
      party() {
        return Parties.findOne({
          _id: $stateParams.partyId
        });
      },

      users() {
        return Meteor.users.find({});
      },

      isLoggedIn() {
        return !!Meteor.userId();
      },

      isOwner() {
        if (!this.party) {
          return false;
        }

        return this.party.owner === Meteor.userId();
      }
    });
  }

  canInvite() {
    if (!this.party) {
      return false;
    }
    return !this.party.public && this.party.owner === Meteor.userId();
  }

  save() {
    Parties.update({
      _id: this.party._id
    }, {
      $set: {
        name: this.party.name,
        description: this.party.description,
        public: this.party.public,
        location: this.party.location
      }
    }, (error) => {
      if (error) {
        // eslint-disable-next-line
        return console.error(error);
      }
      // eslint-disable-next-line
      console.log('Saved correctly!');
    })
  }
}

const name = 'partyDetails';

const partyDetailsComp = angular.module(name, [
  angularMeteor,
  uiRouter,
  PartyCreator,
  PartyUninvited,
  PartyMap
]);

partyDetailsComp.component(name, {
  template,
  controllerAs: name,
  controller: PartyDetails
});

partyDetailsComp.config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('partyDetails', {
    url: '/parties/:partyId',
    template: '<party-details></party-details>',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        return $q.resolve();
      }
    }
  })
}

export default partyDetailsComp;
