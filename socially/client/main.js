import angular from 'angular';

import { Meteor } from 'meteor/meteor';

import { name as Socially } from '../imports/ui/components/socially/socially';

function onReady(){
	// eslint-disable-next-line
	angular.bootstrap(document, [
		Socially
	], {
		strictDi: true
	});
}

if (Meteor.isCordova) {
	// eslint-disable-next-line
	angular.element(document).on('deviceReady', onReady);
} else {
	// eslint-disable-next-line
	angular.element(document).ready(onReady);
}