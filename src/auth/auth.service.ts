import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  generateToken = (userId: number, email: string): string => {
    const secret = process.env.JWT_SECRET || 'super-secret-key';

    if (!secret) {
      throw new InternalServerErrorException('JWT_SECRET is not defined');
    }

    return sign({ userId, email }, secret);
  };
  async signup(@Body() dto: SignupDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    try {
      const result = await this.prismaService.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            accounts: {
              create: [{ name: 'Main', amount: 0 }],
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
            plan: true,
            accounts: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        const token = this.generateToken(user.id, user.email);
        return { user, token };
      });
      return result;
    } catch (error: unknown) {
      console.error(error);
      const prismaError = error as { code?: string };
      if (prismaError.code === 'P2002') {
        throw new BadRequestException('Email already in use');
      }
      throw error;
    }
  }
  async signin(dto: SignupDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    try {
      const result = await this.prismaService.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            accounts: {
              create: [{ name: 'Main', amount: 0 }],
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
            plan: true,
            accounts: true,
            createdAt: true,
            updatedAt: true,
          },
        });
        const token = this.generateToken(user.id, user.email);
        return { user, token };
      });
      return result;
    } catch (error: unknown) {
      console.error(error);
      const prismaError = error as { code?: string };
      if (prismaError.code === 'P2002') {
        throw new BadRequestException('Email already in use');
      }
      throw error;
    }
  }
}
