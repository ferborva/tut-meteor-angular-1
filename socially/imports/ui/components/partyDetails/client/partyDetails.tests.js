/* eslint-disable */
import { name as PartyDetails } from '../partyDetails';
import { Parties } from '../../../../api/parties';
import 'angular-mocks';

describe('PartyDetails', () => {
  beforeEach(() => {
    window.module(PartyDetails);
  });

  describe('controller', () => {
    let controller;
    const party = {
      _id: 'partyId',
      name: 'Party Name',
      description: 'Party Desc',
      public: 'true'
    }
    beforeEach(() => {
      inject(($rootScope, $componentController) => {
        controller = $componentController(PartyDetails, {
          $scope: $rootScope.$new(true)
        })
      });
    });

    describe('save()', () => {
      beforeEach(() => {
        spyOn(Parties, 'update');

        controller.party = party;
        controller.save();
      });

      it('should update a party with the correct Id', () => {
        expect(Parties.update.calls.mostRecent().args[0]).toEqual({ _id: party._id });
      });

      it('should update the party with a correct modifier', () => {
        expect(Parties.update.calls.mostRecent().args[1]).toEqual({
          $set: {
            name: party.name,
            description: party.description,
            public: party.public
          }
        });
      });

      it('should only call the update method once', () => {
        expect(Parties.update.calls.count()).toEqual(1);
      });
    });
  });
});