import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import prisma from '../../src/client';
import { Prisma } from '@prisma/client';
import { Role } from '../../src/services/user.service';

const password = 'password1';
const salt = bcrypt.genSaltSync(8);

export const userOne = {
  name: faker.name.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: Role.USER,
  isEmailVerified: false
};

export const userTwo = {
  name: faker.name.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: Role.USER,
  isEmailVerified: false
};

export const admin = {
  name: faker.name.fullName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: Role.ADMIN,
  isEmailVerified: false
};

export const insertUsers = async (users: Prisma.UserCreateInput[]) => {
  users.forEach(async (user) => {
    await prisma.user.create({
      data: { ...user, password: bcrypt.hashSync(user.password, salt) }
    });
  })
};
