const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Example: get user by username
async function getUserByUsername(username) {
  return await prisma.users.findUnique({
    where: { email: username }
  });
}

// Example: create user
async function createUser(data) {
  return await prisma.users.create({ data });
}

module.exports = {
  getUserByUsername,
  createUser,
  // ...add other user-related functions as needed...
};
