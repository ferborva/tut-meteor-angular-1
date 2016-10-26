import { Mongo } from 'meteor/mongo';

// eslint-disable-next-line
export const Parties = new Mongo.Collection('parties');

Parties.allow({
  // Insert allow rules
  insert(userId, party) {
    return userId && party.owner === userId;
  },

  update(userId, party/*, fields, modifier*/) {
    return userId && party.owner === userId;
  },

  remove(userId, party) {
    return userId && party.owner === userId;
  }
});