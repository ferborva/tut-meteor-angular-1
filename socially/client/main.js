import angular from 'angular';
import angularMeteor from 'angular-meteor';

const app = angular.module('socially', [
  angularMeteor
]);

app.controller('PartyListCtrl', function($scope, $reactive){
  'ngInject';

  $reactive(this).attach($scope);

  this.helpers({
    parties() {
      // Access globally available Parties Collection object
      // eslint-disable-next-line
      return Parties.find({});
    }
  });
});