// src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import prisma from '../prisma/client';
import { GlobalRole } from '@prisma/client';
import { BadRequestException } from '../exceptions/http-exceptions';

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
  // 1. แปลง role เป็น enum
  const roleUpper = role.toUpperCase();
  if (!Object.values(GlobalRole).includes(roleUpper as GlobalRole)) {
    throw new BadRequestException('Invalid Role');
  }
  const roleEnum = roleUpper as GlobalRole;

  // 2. ตรวจสอบ username และ email ซ้ำ
  const existingByUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingByUsername) {
    throw new BadRequestException('Username is already taken');
  }

  if (email && email.trim() !== '') {
    const existingByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingByEmail) {
      throw new BadRequestException('Email is already taken');
    }
  }
  // 3. เข้ารหัสรหัสผ่าน
  const hashedPassword = await bcrypt.hash(password, 10);

  try{
    const user = await prisma.user.create({
      data: {
        username,
        email: email && email.trim() !== '' ? email : null,
        password: hashedPassword,
        role: roleEnum,
      },
    });
        // 5. สร้าง JWT แล้ว return
    const token = generateToken({ id: user.id, role: user.role });
    return { token, user };
  }catch(err){
    throw new BadRequestException('Something went wrong')
  }
  
  


};

export const login = async ({ username, password }: LoginInput) => {
  // 1. หา user ตาม username
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // 2. ตรวจสอบรหัสผ่าน
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // 3. สร้าง JWT แล้ว return
  const token = generateToken({ id: user.id, role: user.role });
  return { token, user };
};
