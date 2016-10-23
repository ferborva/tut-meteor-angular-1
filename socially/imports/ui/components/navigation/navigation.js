import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './navigation.html';

const name = 'navigation';

const nav = angular.module(name, [
  angularMeteor
]);

nav.component(name, {
  template,
  controllerAs: name
});

export default nav;