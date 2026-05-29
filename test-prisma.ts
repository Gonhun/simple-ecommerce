import { PrismaClient } from '@prisma/client';

async function main() {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: "postgres://c039752be54c674032aed78604ecdbbf829952db7485b46363c4ed88f4314e96:sk_X6_lIRCH6n8Czg9kzNaBj@db.prisma.io:5432/postgres?sslmode=require"
    });
    const users = await prisma.user.findMany();
    console.log(users);
  } catch (e) {
    console.error(e);
  }
}
main();
