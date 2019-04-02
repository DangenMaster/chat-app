const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {
  let users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Shivam',
      room: 'Chat room 1'
    }, {
      id: '2',
      name: 'Tisha',
      room: 'Chat room 2'
    }, {
      id: '3',
      name: 'Ruhan',
      room: 'Chat room 1'
    }];
  });

  it('should add new user', () => {
    let users = new Users();
    const user = {
      id: '123',
      name: 'Apoorv',
      room: 'Chat room for DangenMasters'
    };
    users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it('should get the user', () => {
    const id = '2';
    const user = users.getUser(id);
    expect(user).toEqual({ id: '2', name: 'Tisha', room: 'Chat room 2' });
  });

  it('should not get the user', () => {
    const id = '4';
    const user = users.getUser(id);
    expect(user).toBeUndefined();
  });

  it('should remove the user', () => {
    const id = '2';
    const user = users.removeUser(id);
    expect(user).toEqual({ id: '2', name: 'Tisha', room: 'Chat room 2' });
    expect(users.users.length).toBe(2);
  });

  it('should not remove the user', () => {
    const id = '4';
    const user = users.removeUser(id);
    expect(user).toBeUndefined();
  });

  it('should return users name for the given room', () => {
    const userList = users.getUserList('Chat room 1');
    expect(userList).toEqual(['Shivam', 'Ruhan']);
  });
});