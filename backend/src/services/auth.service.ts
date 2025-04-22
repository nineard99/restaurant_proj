import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import prisma from '../prisma/client';
import { Role } from '@prisma/client';

type RegisterInput = {
  username: string;
  password: string;
  email?: string;
  name?: string;
  role?: string;
};
type LoginInput = {
  username: string;
  password: string;
};

export const register = async ({
  username,
  password,
  email,
  name,
  role = 'CUSTOMER',
}: RegisterInput) => {
  const hashed = await bcrypt.hash(password, 10);
  const roleEnum = role.toUpperCase() as Role;

  if (!Object.values(Role).includes(roleEnum)) {
    throw new Error('Invalid role');
  }

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) throw new Error('Username is already taken');
  if(email){
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) throw new Error('Email is already taken');
  }
  

  const user = await prisma.user.create({
    data: { username, email, password: hashed, name, role: roleEnum },
  });

  const token = generateToken({ id: user.id, role: user.role });
  return { token, user };
};


export const login = async ({username, password} : LoginInput) => {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = generateToken({ id: user.id, role: user.role });
    return { token, user };
  };