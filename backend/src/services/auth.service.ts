import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import prisma from '../prisma/client';
import { GlobalRole } from '@prisma/client';
import {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  ConflictException,
} from '../exceptions/http-exceptions';
import { HttpException } from '../exceptions/root';

type RegisterInput = {
  username: string;
  password: string;
  email?: string;
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
  role = 'CUSTOMER',
}: RegisterInput) => {
  if (!username || username.trim() === '') {
    throw new BadRequestException('Username is required.');
  }
  if (!password || password.trim() === '') {
    throw new BadRequestException('Password is required.');
  }

  // 1. Convert role string to enum
  const roleUpper = role.toUpperCase();
  if (!Object.values(GlobalRole).includes(roleUpper as GlobalRole)) {
    throw new BadRequestException('Invalid role provided.');
  }
  const roleEnum = roleUpper as GlobalRole;

  try {
    // 2. Check if username or email already exists
    const existingByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingByUsername) {
      throw new ConflictException('Username is already taken.');
    }

    if (email && email.trim() !== '') {
      const existingByEmail = await prisma.user.findUnique({
        where: { email },
      });
      if (existingByEmail) {
        throw new ConflictException('Email is already taken.');
      }
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user
    const user = await prisma.user.create({
      data: {
        username,
        email: email && email.trim() !== '' ? email : null,
        password: hashedPassword,
        role: roleEnum,
      },
    });

    // 5. Generate JWT token
    const token = generateToken({ id: user.id, role: user.role });

    return { token, user };
  } catch (error: any) {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(
      'An unexpected error occurred while registering the user.'
    );
  }
};

export const login = async ({ username, password }: LoginInput) => {
  if (!username || username.trim() === '') {
    throw new BadRequestException('Username is required.');
  }
  if (!password || password.trim() === '') {
    throw new BadRequestException('Password is required.');
  }

  try {
    // 1. Find user by username
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid username or password.');
    }

    // 3. Generate JWT token
    const token = generateToken({ id: user.id, role: user.role });

    return { token, user };
  } catch (error: any) {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException(
      'An unexpected error occurred while logging in.'
    );
  }
};
