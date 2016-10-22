import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // eslint-disable-next-line
  if (Parties.find({}).count() === 0) {
    const parties = [
      {
        'name': 'Dubstep-Free Zone',
        'description': 'Fast just got faster with Nexus S.'
      }, {
        'name': 'All dubstep all the time',
        'description': 'Get it on!'
      }, {
        'name': 'Savage lounging',
        'description': 'Leisure suit required. And only fiercest manners.'
      }
    ];

    parties.forEach(party => {
      // eslint-disable-next-line
      Parties.insert(party);
    });
  }
});