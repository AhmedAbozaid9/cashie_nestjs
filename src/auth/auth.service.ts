import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { handlePrismaError } from '../common/prisma-errors';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SigninDto } from './dto/signin.dto';
import { User } from '../generated/prisma/client';

export type UserWithoutPassword = Omit<User, 'password'>;

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

  async signup(dto: SignupDto) {
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
            createdAt: true,
            updatedAt: true,
          },
        });
        const token = this.generateToken(user.id, user.email);
        return { user, token };
      });
      return result;
    } catch (error: unknown) {
      handlePrismaError(error);
      console.error(error);
      throw error;
    }
  }

  async signin(dto: SigninDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }
    const token = this.generateToken(user.id, user.email);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  getCurrentUser(user: UserWithoutPassword): UserWithoutPassword {
    return user;
  }

  async updateCurrentUser(userId: number, dto: Partial<SignupDto>) {
    try {
      return await this.prismaService.user.update({
        where: { id: userId },
        data: { ...dto },
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error: unknown) {
      handlePrismaError(error);
      console.error(error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw new BadRequestException('Current password is incorrect');
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await this.prismaService.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });
    } catch (error) {
      handlePrismaError(error);
      throw error;
    }
  }
}
