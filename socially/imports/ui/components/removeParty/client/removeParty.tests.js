/* eslint-disable */
import { name as RemoveParty } from '../removeParty';
import { Parties }  from '../../../../api/parties';
import 'angular-mocks';

describe('RemoveParty', () => {
  beforeEach(() => {
    window.module(RemoveParty);
  });

  describe('controller', () => {
    let controller;
    const party = {
      _id: 'paryId'
    };

    beforeEach(() => {
      inject(($rootScope, $componentController) => {
        controller = $componentController(RemoveParty, {
          $scope: $rootScope.$new(true)
        }, {
          party
        });
      });
    });

    describe('remove()', () => {
      beforeEach(() => {
        spyOn(Parties, 'remove');
        controller.remove();
      });

      it('should remove a party', () => {
        expect(Parties.remove).toHaveBeenCalledWith(party._id);
      });
    });
  });
});