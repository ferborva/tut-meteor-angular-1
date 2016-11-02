import { contains, findWhere } from 'underscore';
import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { check } from 'meteor/check';

import { Parties } from './collection';

function getContactEmail(user) {
  if (user.emails && user.emails.length) {
    return user.emails[0].address;
  }

  if (user.services && user.services.facebook && user.services.facebook.email) {
    return user.services.facebook.email;
  }

  return null;
}

export function invite(partyId, userId) {
  check(partyId, String);
  check(userId, String);

  if (!this.userId) {
    throw new Meteor.Error(403, 'You have to be logged in to perform this transaction');
  }

  const party = Parties.findOne(partyId);

  if (!party) {
    throw new Meteor.Error(404, 'No such party!');
  }

  if (party.owner !== this.userId) {
    throw new Meteor.Error(403, 'No permission!');
  }

  if (party.public) {
    throw new Meteor.Error(400, 'Public Party! No need to invite people');
  }

  if (userId !== party.owner && !contains(party.invited, userId)) {
    Parties.update(partyId, {
      $addToSet: {
        invited: userId
      }
    });

    const replyTo = getContactEmail(Meteor.users.findOne(this.userId));
    const to = getContactEmail(Meteor.users.findOne(userId));

    if (Meteor.isServer && to) {
      Email.send({
        to,
        replyTo,
        from: 'noreply@socially.com',
        subject: `Party Invitation: ${party.title}`,
        text: `
Hey there!

I've just invited you to the '${party.title}'' party using Socially.
Come and check it out: ${Meteor.absoluteUrl()}
        `
      });
    }
  }
}

export function rsvp(partyId, rsvp) {
  check(partyId, String);
  check(rsvp, String);
 
  if (!this.userId) {
    throw new Meteor.Error(403, 'You must be logged in to RSVP');
  }
 
  if (!contains(['yes', 'no', 'maybe'], rsvp)) {
    throw new Meteor.Error(400, 'Invalid RSVP');
  }
 
  const party = Parties.findOne({
    _id: partyId,
    $or: [{
      // is public
      $and: [{
        public: true
      }, {
        public: {
          $exists: true
        }
      }]
    },{
      // is owner
      $and: [{
        owner: this.userId
      }, {
        owner: {
          $exists: true
        }
      }]
    }, {
      // is invited
      $and: [{
        invited: this.userId
      }, {
        invited: {
          $exists: true
        }
      }]
    }]
  });
 
  if (!party) {
    throw new Meteor.Error(404, 'No such party');
  }
 
  const hasUserRsvp = findWhere(party.rsvps, {
    user: this.userId
  });
 
  if (!hasUserRsvp) {
    // add new rsvp entry
    Parties.update(partyId, {
      $push: {
        rsvps: {
          rsvp,
          user: this.userId
        }
      }
    });
  } else {
    // update rsvp entry
    const userId = this.userId;
    Parties.update({
      _id: partyId,
      'rsvps.user': userId
    }, {
      $set: {
        'rsvps.$.rsvp': rsvp
      }
    });
  }
}
 
Meteor.methods({
  invite,
  rsvp
});