import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';
import { Meteor } from 'meteor/meteor';

import template from './partiesList.html';
import { Parties } from '../../../api/parties';
import { name as PartiesSort } from '../partiesSort/partiesSort';
import { name as PartyAdd } from '../partyAdd/partyAdd';
import { name as RemoveParty } from '../removeParty/removeParty';
import { name as PartyCreator } from '../partyCreator/partyCreator';
import { name as PartyRsvp } from '../partyRsvp/partyRsvp';
import { name as PartyRsvpList } from '../partyRsvpList/partyRsvpList';
import { name as PartyUnanswered } from '../partyUnanswered/partyUnanswered';
import { name as PartiesMap } from '../partiesMap/partiesMap';

class PartiesList {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };

    this.subscribe('parties', () => [
      {
        limit: parseInt(this.perPage),
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText')
    ]);

    this.subscribe('users');

    this.helpers({
      parties(){
        // eslint-disable-next-line
        return Parties.find({}, {
          sort: this.getReactively('sort')
        });
      },
      partiesCount() {
        return Counts.get('numberOfParties');
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      getCurrentUser() {
        return Meteor.userId();
      }
    });
  }

  isOwner(party) {
    return this.isLoggedIn && party.owner === this.getCurrentUser;
  }

  pageChanged(newPage) {
    this.page = newPage;
  }

  sortChanged(newSort) {
    this.sort = newSort;
  }
}

const name = 'partiesList';

// Create the angular module
const partiesListComp = angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  PartiesSort,
  PartyAdd,
  RemoveParty,
  PartyCreator,
  PartyRsvp,
  PartyRsvpList,
  PartyUnanswered,
  PartiesMap
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