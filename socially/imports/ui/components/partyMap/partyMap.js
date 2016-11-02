import angular from 'angular';
import angularMeteor from 'angular-meteor';
import 'angular-simple-logger';
import 'angular-google-maps';

import './partyMap.css';
import template from './partyMap.html';
 
class PartyMap {
  constructor($scope) {
    'ngInject';
 
    this.map = {
      center: {
        latitude: 50.831746,
        longitude: 3.265815
      },
      zoom: 12,
      events: {
        click: (mapModel, eventName, originalEventArgs) => {
          this.setLocation(originalEventArgs[0].latLng.lat(), originalEventArgs[0].latLng.lng());
          $scope.$apply();
        }
      }
    };
 
    this.marker = {
      options: {
        draggable: true
      },
      events: {
        dragend: (marker, eventName, args) => {
          this.setLocation(marker.getPosition().lat(), marker.getPosition().lng());
          $scope.$apply();
        }
      }
    };
  }

  setLocation(latitude, longitude) {
    this.location = {
      latitude,
      longitude
    }
  }
}
 
const name = 'partyMap';
 
const comp = angular.module(name, [
  angularMeteor,
  'nemLogging', // https://github.com/angular-ui/angular-google-maps/issues/1633
  'uiGmapgoogle-maps'
]);

comp.component(name, {
  template,
  controllerAs: name,
  bindings: {
    location: '='
  },
  controller: PartyMap
});

export default comp;