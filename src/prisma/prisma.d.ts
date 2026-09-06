import { PrismaClient } from '@prisma/client';

declare module '@prisma/client' {
  interface PrismaClient {
    user: PrismaClient['user'];
    savedCollege: PrismaClient['savedCollege'];
    savedComparison: PrismaClient['savedComparison'];
    question: PrismaClient['question'];
    answer: PrismaClient['answer'];
  }
}