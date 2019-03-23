const expect = require('expect');
const { generateMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const from = 'Ruhan';
    const text = 'Dummy text';
    const message = generateMessage(from, text);
    expect(message.createdAt).not.toBeNaN();
    expect(message).toMatchObject({from, text})
  });
});