/* eslint-disable */
import { invite, rsvp } from './methods';
import { Parties } from './collection';

import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  describe('Parties / Methods', () => {
    describe('invite', () => {
      function loggedIn(userId = 'userId') {
        return {
          userId
        };
      }

      it('should be called from Method', () => {
        spyOn(invite, 'apply');

        try {
          Meteor.call('invite');
        } catch(e) {}

        expect(invite.apply).toHaveBeenCalled();
      });

      it('should fail on missing partyId', () => {
        expect(() => {
          invite.call({});
        }).toThrowError();
      });

      it('should fail on missing userId', () => {
        expect(() => {
          invite.call({}, 'partyId');
        }).toThrowError();
      });

      it('should fail on user not logged in', () => {
        expect(() => {
          invite.call({}, 'partyId', 'userId');
        }).toThrowError(/you have to be logged in to perform this transaction/i);
      });

      it('should look for a party', () => {
        const partyId = 'partyId';
        spyOn(Parties, 'findOne');
        try{
          invite.call(loggedIn(), partyId, 'userId');
        } catch(e) {}

        expect(Parties.findOne).toHaveBeenCalledWith(partyId);
      });

      it('should fail if the party does not exists', () => {
        const partyId = 'partyId';
        spyOn(Parties, 'findOne').and.returnValue(undefined);

        expect(() => {
          invite.call(loggedIn(), partyId, 'userId');
        }).toThrowError(/404/);
      });

      it('should fail if the user is not the owner', () => {
        const partyId = 'partyId';
        spyOn(Parties, 'findOne').and.returnValue({owner: 'notUserId'});

        expect(() => {
          invite.call(loggedIn(), partyId, 'userId');
        }).toThrowError(/403/);
      });

      it('should fail if the party is public', () => {
        const partyId = 'partyId';
        spyOn(Parties, 'findOne').and.returnValue({
          public: true,
          owner: 'userId'
        });

        expect(() => {
          invite.call(loggedIn(), partyId, 'userId');
        }).toThrowError(/400/);
      });

      it('should NOT invite user who is the owner', () => {
        const party = 'partyId';
        spyOn(Parties, 'findOne').and.returnValue({
          public: false,
          owner: 'userId'
        });
        spyOn(Parties, 'update');

        try{
          invite.call(loggedIn(), partyId, 'userId');
        } catch(e) {}

        expect(Parties.update).not.toHaveBeenCalled();
      });

      it('should NOT invite users who have already been invited', () => {
        const partyId = 'partyId';
        spyOn(Parties, 'findOne').and.returnValue({
          public: false,
          owner: 'notUserId',
          invited: [
            'userId'
          ]
        });
        spyOn(Parties, 'update');

        try{
          invite.call(loggedIn(), partyId, 'userId');
        } catch(e) {}

        expect(Parties.update).not.toHaveBeenCalled();
      });

      it('should invite user who has not been invited and is not the owner', () => {
        const partyId = 'partyId';
        const userId = 'notUserId';
        spyOn(Parties, 'findOne').and.returnValue({
          owner: 'userId',
          invited: ['anotherUser']
        });
        spyOn(Parties, 'update');
        spyOn(Meteor.users, 'findOne').and.returnValue({});

        invite.call(loggedIn(), partyId, userId);

        expect(Parties.update).toHaveBeenCalledWith(partyId, {
          $addToSet: {
            invited: userId
          }
        });
      });
    });

    describe('rsvp', () => {
      function loggedIn(userId = 'userId') {
        return {
          userId
        }
      }

      it('should be called from Method', () => {
        spyOn(rsvp, 'apply');

        try{
          Meteor.call('rsvp');
        } catch(e) {}

        expect(rsvp.apply).toHaveBeenCalled();
      });

      it('should fail on missing partyId', () => {
        expect(() => {
          rsvp.call({});
        }).toThrowError();
      });

      it('should fail on missing rsvp type', () => {
        expect(() => {
          rsvp.call({}, 'partyId');
        }).toThrowError();
      });

      it('should fail if the user is not logged in', () => {
        expect(() => {
          rsvp.call({}, 'partyId', 'rsvpType');
        }).toThrowError(/403/);
      });

      it('should fail on wrong rsvpType', () => {
        const partyId = 'partyId';
        const rsvpType = 'wrongType';

        expect(() => {
          rsvp.call(loggedIn(), partyId, rsvpType);
        }).toThrowError(/400/);
      });

      ['yes', 'no', 'maybe'].forEach((item) => {
        it(`should NOT fail when rvsp type is ${item}`, () => {
          expect(() => {
            rsvp.call(loggedIn(), 'partyId', item);
          }).not.toThrowError(/400/);
        });
      });

      it('should fail if no party has been found', () => {
        spyOn(Parties, 'findOne').and.returnValue(undefined);

        expect(() => {
          rsvp.call(loggedIn(), 'partyId', 'yes');
        }).toThrowError(/404/);
      });

      it('should create a new RSVP entry if the user has not answer yet', () => {
        spyOn(Parties, 'findOne').and.returnValue({
          rsvps: [
            {
              user: 'userNotAnsweredYet'
            }
          ]
        });
        spyOn(Parties, 'update');

        try {
          rsvp.apply(loggedIn(), ['partyId', 'yes']);
        } catch(e) {}

        expect(Parties.update).toHaveBeenCalledWith('partyId', {
          $push: {
            rsvps: {
              rsvp: 'yes',
              user: 'userId'
            }
          }
        });
      });

      it('should update an RSVP entry if the user already answered', () => {
        spyOn(Parties, 'findOne').and.returnValue({
          rsvps: [
            {
              user: 'userId'
            }
          ]
        });
        spyOn(Parties, 'update');

        try {
          rsvp.apply(loggedIn(), ['partyId', 'yes']);
        } catch(e) {}

        expect(Parties.update).toHaveBeenCalledWith({
          _id: 'partyId',
          'rsvps.user': 'userId'
        }, {
          $set: {
            'rsvps.$.rsvp': 'yes'
          }
        });
      });
    });
  });
}