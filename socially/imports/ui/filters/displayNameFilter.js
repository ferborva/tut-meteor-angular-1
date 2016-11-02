import angular from 'angular';

const name = 'displayNameFilter';

function DisplayNameFilter(user) {
	if (!user) {
		return '';
	}

	// Only for facebook users
	if (user.profile && user.profile.name) {
		return user.profile.name;
	}

	if (user.emails) {
		return user.emails[0].address;
	}

	return user;
}

const filt = angular.module(name, []);

filt.filter(name, () => {
	return DisplayNameFilter;
});

export default filt;