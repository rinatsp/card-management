import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';


const prisma = new PrismaClient();

async function main() {
  const hashedPassword = bcrypt.hashSync('password123', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Rinat Garifullin',
      email: 'rinat@example.com',
      password: hashedPassword,
    },
  });

  const product1 = await prisma.product.create({
    data: {
      name: 'Product 1',
      price: 100.0,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Product 2',
      price: 200.0,
    },
  });

  await prisma.cart.create({
    data: {
      user: {
        connect: { id: user.id },
      },
      items: {
        create: [
          {
            product: { connect: { id: product1.id } },
            quantity: 2,
          },
          {
            product: { connect: { id: product2.id } },
            quantity: 1,
          },
        ],
      },
    },
  });

  console.log({ user, product1, product2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
