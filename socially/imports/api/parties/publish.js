import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { check, Match } from 'meteor/check';

import { Parties } from './collection';

if (Meteor.isServer) {
  Meteor.publish('parties', function (options) {
    const optPattern = {
      sort: Match.Maybe(Object),
      limit: Match.Maybe(Number),
      skip: Match.Maybe(Number)
    }
    check(options, optPattern);

    const selector = {
      $or: [
        {
          $and: [
            {
              public: true
            },
            {
              public: { $exists: true }
            }
          ]
        },
        {
          $and: [
            {
              owner: this.userId
            },
            {
              owner: { $exists: true }
            }
          ]
        }
      ]
    };

    Counts.publish(this, 'numberOfParties', Parties.find(selector), {
      noReady: true
    });

    return Parties.find(selector, options);
  });
}