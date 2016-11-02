import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { check, Match } from 'meteor/check';

import { Parties } from './collection';

if (Meteor.isServer) {
  Meteor.publish('parties', function (options, searchString) {
    const optPattern = {
      sort: Match.Maybe(Object),
      limit: Match.Maybe(Number),
      skip: Match.Maybe(Number)
    }
    check(options, Match.Maybe(optPattern));
    check(searchString, Match.Maybe(String));


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
        },
        {
          $and: [
            {
              invited: this.userId
            },
            {
              invited: { $exists: true }
            }
          ]
        }
      ]
    };

    if (searchString && searchString.length) {
      selector.name = {
        $regex: `.*${searchString}.*`,
        $options: 'i'
      };
    }

    Counts.publish(this, 'numberOfParties', Parties.find(selector), {
      noReady: true
    });

    return Parties.find(selector, options);
  });
}