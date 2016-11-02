/* eslint-disable */
import { name as PartyCreator } from '../partyCreator';

import 'angular-mocks';

describe('PartyCreator', () => {
  beforeEach(() => {
    window.module(PartyCreator);
  });

  describe('controller', () => {
    let $rootScope;
    let $componentController;
    const party = {
      _id: 'partyId'
    };

    beforeEach(() => {
      inject((_$rootScope_, _$componentController_) => {
        $rootScope = _$rootScope_;
        $componentController = _$componentController_;
      });
    }); 

    function component(bindings) {
      return $componentController(PartyCreator, {
        $scope: $rootScope.$new(true)
      }, bindings);
    }

    it('should return an empty string if there is no party', () => {
      const controller = component({
        party: undefined
      });

      expect(controller.creator).toEqual('');
    });

    it('should return `me` if logged in user is the owner', () => {
      const owner = 'userId';

      spyOn(Meteor, 'userId').and.returnValue(owner);
      const controller = component({
        party: {
          owner
        }
      });

      expect(controller.creator).toEqual('me');
    });

    it('should return `nobody` if the owner user does not exist', () => {
      const owner = 'userId';

      spyOn(Meteor, 'userId').and.returnValue(null);
      spyOn(Meteor.users, 'findOne').and.returnValue(undefined);

      const controller = component({
        party: {
          owner
        }
      });

      expect(controller.creator).toEqual('nobody');
    });

    it('should return user data if the owner user exists and is not the logged in user', () => {
      const owner = 'userId';

      spyOn(Meteor, 'userId').and.returnValue(null);
      spyOn(Meteor.users, 'findOne').and.returnValue('found');

      const controller = component({
        party:{
          owner
        }
      });

      expect(controller.creator).toEqual('found');
    });
  });
});