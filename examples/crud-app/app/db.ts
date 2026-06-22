export interface User {
  id: string;
  name: string;
  email: string;
}

let users: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

export async function getUsers() {
  return [...users];
}

export async function getUser(id: string) {
  return users.find((u) => u.id === id);
}

export async function createUser(name: string, email: string) {
  const newUser = { id: Math.random().toString(36).substr(2, 9), name, email };
  users.push(newUser);
  return newUser;
}

export async function deleteUser(id: string) {
  users = users.filter((u) => u.id !== id);
}

export async function updateUser(id: string, name: string, email: string) {
  const user = users.find((u) => u.id === id);
  if (user) {
    user.name = name;
    user.email = email;
  }
}
