import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const dbUrl = process.env.DATABASE_URL;
    console.log('DATABASE_URL:', dbUrl);
    if (!dbUrl) {
      throw new Error('Missing required environment variable: DATABASE_URL');
    }

    const adapter = new PrismaMariaDb(dbUrl);

    super({
      adapter,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
