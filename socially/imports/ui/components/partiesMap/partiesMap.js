import angular from 'angular';
import angularMeteor from 'angular-meteor';
import 'angular-simple-logger';
import 'angular-google-maps';
 
import template from './partiesMap.html';
 
/**
 * PartiesMap component
 */
class PartiesMap {
  constructor() {
    this.map = {
      center: {
        latitude: 50,
        longitude: 3
      },
      zoom: 10
    };
  }
}
 
const name = 'partiesMap';
 
const comp =  angular.module(name, [
  angularMeteor,
  'nemLogging', // https://github.com/angular-ui/angular-google-maps/issues/1633
  'uiGmapgoogle-maps'
]);

comp.component(name, {
  template,
  controllerAs: name,
  bindings: {
    parties: '='
  },
  controller: PartiesMap
});

export default comp;