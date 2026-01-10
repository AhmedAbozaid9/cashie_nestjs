import { Prisma } from '../generated/prisma/client';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

/**
 * Handles Prisma known request errors and maps them to NestJS HTTP exceptions.
 * Use this in catch blocks to provide meaningful feedback to the user.
 */
export function handlePrismaError(error: unknown): void {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const meta = error.meta as Record<string, any> | undefined;

    switch (error.code) {
      case 'P2002': {
        const target = meta?.target as unknown;
        let fields = 'field';
        if (Array.isArray(target)) {
          fields = target.join(', ');
        } else if (typeof target === 'string') {
          fields = target;
        }
        throw new ConflictException(`${fields} already in use`);
      }

      case 'P2025': {
        const cause = meta?.cause as unknown;
        const message = typeof cause === 'string' ? cause : 'Record';
        throw new NotFoundException(`${message} not found`);
      }

      case 'P2003': {
        throw new BadRequestException('Foreign key constraint failed');
      }

      default:
        break;
    }
  }
}
