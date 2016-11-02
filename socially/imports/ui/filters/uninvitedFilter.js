import angular from 'angular';
import { contains } from 'underscore';
 
const name = 'uninvitedFilter';
 
function UninvitedFilter(users, party) {
  if (!party) {
    return false;
  }
 
  return users.filter((user) => {
    // if not the owner and not invited
    return user._id !== party.owner && !contains(party.invited, user._id);
  });
}
 
const filt = angular.module(name, []);

filt.filter(name, () => {
  return UninvitedFilter;
});

export default filt;