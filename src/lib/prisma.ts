import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 检查和修正数据库URL格式
let dbUrl = process.env.DATABASE_URL || '';
if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
  console.error('Invalid DATABASE_URL format:', dbUrl);
  // 如果URL不是以正确的协议开头，尝试修正
  if (dbUrl.includes('postgresql') || dbUrl.includes('postgres')) {
    dbUrl = `postgresql://${dbUrl.split('://')[1]}`;
    console.log('Corrected DATABASE_URL:', dbUrl);
  }
}

let prisma: PrismaClient;

try {
  prisma = globalForPrisma.prisma ?? new PrismaClient({
    datasources: {
      db: {
        url: dbUrl
      }
    }
  });
  
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
} catch (error) {
  console.error('Prisma Client initialization error:', error);
  throw error;
}

export { prisma }; 