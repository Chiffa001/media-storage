import { getMaskedObject } from '../mask';

describe('utils/mask', () => {
  describe('getMaskedObject', () => {
    it.each([
      [
        {
          username: 'john_doe',
          password: 'supersecret',
          profile: {
            ssn: '123-45-6789',
            email: 'john@example.com',
          },
        },
        {
          username: 'john_doe',
          password: '******',
          profile: {
            ssn: '******',
            email: 'john@example.com',
          },
        },
      ],
      ['string value', 'string value'],
      [{}, {}],
      [
        [
          { username: 'john_doe', password: 'supersecret' },
          { username: 'jane_doe', ssn: '987-65-4321' },
        ],
        [
          { username: 'john_doe', password: '******' },
          { username: 'jane_doe', ssn: '******' },
        ],
      ],
      [
        {
          name: 'Alice',
          age: 30,
          details: {
            city: 'Wonderland',
            country: 'Fantasyland',
          },
        },
        {
          name: 'Alice',
          age: 30,
          details: {
            city: 'Wonderland',
            country: 'Fantasyland',
          },
        },
      ],
    ])('should correctly mask keys for input: %o', (input, expectedOutput) => {
      expect(getMaskedObject(input)).toEqual(expectedOutput);
    });
  });
});
