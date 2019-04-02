class Users {
  constructor() {
    this.users = [];
  }
  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);
    return user;
  }
  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }
  removeUser(id) {
    const user = this.getUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }
  getUserList(room) {
    const users = this.users.filter((user) => user.room === room);
    const nameArray = users.map(({ name }) => name);
    return nameArray;
  }
}

module.exports = { Users };